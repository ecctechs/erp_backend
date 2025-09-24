# 🚀 ERP Backend API

![GitHub repo size](https://img.shields.io/github/repo-size/username/repo-name)
![GitHub contributors](https://img.shields.io/github/contributors/username/repo-name)
![GitHub stars](https://img.shields.io/github/stars/username/repo-name?style=social)
![GitHub forks](https://img.shields.io/github/forks/username/repo-name?style=social)

## 📖 คำอธิบาย
ระบบ ERP Backend ที่พัฒนาโดยใช้ Node.js + Express + Sequelize (PostgreSQL) สำหรับจัดการธุรกิจ ครอบคลุมการทำงานด้าน User, Employee, Product, Quotation, Invoice, Migration และ File Upload
---

## ⚙️ วิธีการติดตั้ง

1. Clone โปรเจกต์นี้ลงเครื่องของคุณ:
   ```bash 
   git clone https://github.com/ecctechs/erp_backend.git
   cd erp_backend


## ฟีเจอร์หลัก

  1 **Auth (ล็อกอิน / ลงทะเบียน)**  
  - Login รับ JWT Token  
  - Register ผู้ใช้ใหม่ + สร้าง Business/Employee อัตโนมัติ  

  2 **Employee (พนักงาน)**  
  - เพิ่ม / แก้ไข / ลบ พนักงาน  
  - จัดการแผนก (Department)  
  - จัดการเงินเดือน (Salary)  

  3 **Product (สินค้า)**  
  - เพิ่ม / แก้ไข / ลบ สินค้า  
  - แบ่งหมวดหมู่ (Category / Type)  
  - จัดการ Stock ด้วย Transaction (รับเข้า / เบิกออก)  
  - อัปโหลดรูปสินค้าไป Cloudinary  

  4 **Quotation & Invoice (ใบเสนอราคา/ใบแจ้งหนี้)**  
  - เพิ่ม / แก้ไข / ลบ ลูกค้า  
  - จัดการ Business + Bank  
  - สร้างใบเสนอราคา → ออกใบแจ้งหนี้อัตโนมัติ  
  - รองรับ Tax Invoice  

  5 **Migration / Upload**  
  - Export ตารางเป็น CSV  
  - Export ทุกตารางรวมไฟล์ ZIP  
  - Import CSV เข้า Database  
  - Upload ZIP → Extract CSV แล้วบันทึกเข้า DB  

---


## 🖥️ เครื่องมือที่ใช้ในการพัฒนา

1. ระบบปฏิบัติการ Windows 10
2. Express.js 
3. PostgreSQL
4. Sequelize
5. Cloudinary
6. JWT (JSON Web Token)

