
import { GoogleGenAI, Modality } from "@google/genai";

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const speakText = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly in standard Mandarin: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Voice names: 'Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    // Iterate through parts to find the audio data, as the model might return text preamble in some cases
    let base64Audio: string | undefined;
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        base64Audio = part.inlineData.data;
        break;
      }
    }

    if (!base64Audio) {
      console.warn("No audio data found in response parts. Response:", response);
      throw new Error("No audio data received");
    }

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();
  } catch (error) {
    console.error("Speech error:", error);
    // Fallback to browser TTS if API fails or no audio data is found
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-CN';
    window.speechSynthesis.speak(msg);
  }
};
