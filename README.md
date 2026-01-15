
# Mandarin Master Website - Local Setup Guide

เพื่อให้โค้ดนี้รันบนเครื่องคอมพิวเตอร์ของคุณ (VS Code) ได้อย่างถูกต้อง โปรดทำตามขั้นตอนดังนี้:

### 1. โครงสร้างไฟล์
ตรวจสอบให้แน่ใจว่าไฟล์อยู่ในโครงสร้างนี้:
- `index.html`
- `index.tsx`
- `App.tsx`
- `types.ts`
- `data.ts`
- `services/geminiService.ts`
- `components/` (มีไฟล์ Sidebar.tsx, Home.tsx, เป็นต้น)

### 2. วิธีรัน
เนื่องจากโค้ดนี้ใช้ **ES Modules** คุณไม่สามารถดับเบิลคลิกไฟล์ `.html` เพื่อเปิดตรงๆ ได้ คุณต้องมี **Local Server**:
- **วิธีที่ 1 (ง่ายที่สุด):** ติดตั้ง Extension ใน VS Code ที่ชื่อว่า **"Live Server"** จากนั้นคลิกขวาที่ `index.html` แล้วเลือก **"Open with Live Server"**
- **วิธีที่ 2 (แบบมืออาชีพ):** ใช้ Vite โดยรันคำสั่งใน Terminal:
  ```bash
  npm create vite@latest . -- --template react-ts
  npm install @google/genai
  npm run dev
  ```

### 3. ตั้งค่า API Key
เว็บไซต์นี้ต้องการ API Key ของ Google Gemini เพื่อใช้ระบบออกเสียง (TTS):
- เปิดไฟล์ `services/geminiService.ts`
- เปลี่ยน `process.env.API_KEY` เป็น Key ของคุณโดยตรง (เช่น `'YOUR_API_KEY_HERE'`) หรือตั้งค่าผ่านระบบ Environment ของ Vite

### 4. การจัดการข้อมูล
คุณสามารถเพิ่มคำศัพท์ลงในอาร์เรย์ `hskData` ในไฟล์ `data.ts` ได้เรื่อยๆ ตามรูปแบบเดิมที่ให้ไว้ ระบบจะทำการเพิ่มเข้าไปในหน้าเว็บโดยอัตโนมัติครับ
