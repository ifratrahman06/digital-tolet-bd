# Digital To-Let BD (ডিজিটাল টু-লেট বাংলাদেশ) 🇧🇩

বাংলাদেশের শিক্ষার্থী, কর্মজীবী এবং পরিবারের জন্য ঝামেলাহীন ও আধুনিক ডিজিটাল বাসা খোঁজার ফুলস্ট্যাক ওয়েব প্ল্যাটফর্ম।

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20(Free)-green?style=for-the-badge&logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Upload-blueviolet?style=for-the-badge&logo=cloudinary)

---

## 🌟 প্রধান বৈশিষ্ট্যসমূহ (Features)

1. **রিয়েল-টাইম সার্চ ও ফিল্টার:**
   - এলাকা (ধানমন্ডি, মিরপুর, গুলশান, ইত্যাদি) ও জেলা অনুযায়ী সার্চ।
   - ফ্যামিলি, ব্যাচেলর (ছেলে/মেয়ে), সাবলেট, কম বাজেট (≤১৫,০০০), লিফট অনুযায়ী ইনস্ট্যান্ট ফিল্টারিং।
2. **ফ্রি বিজ্ঞাপন দিন (Post Ad):**
   - বাড়িওয়ালা বা মেস মেম্বার ছবি আপলোড করে সরাসরি বিজ্ঞাপন প্রকাশ করতে পারে।
3. **সরাসরি যোগাযোগ:**
   - কোনো দালাল বা তৃতীয় পক্ষ ছাড়াই বাড়িওয়ালার সাথে সরাসরি ফোন কল বা প্রাক-পূরণকৃত WhatsApp মেসেজে যোগাযোগ।
4. **১০০% রেসপনসিভ ও মডার্ন অ্যানিমেশন:**
   - মোবাইল, ট্যাবলেট ও ডেক্সটপে দ্রুত ও স্মুথ পারফরম্যান্স।
5. **ক্লাউড ডাটাবেস ও ইমেজ স্টোরেজ:**
   - MongoDB Atlas (500MB Free Tier) এবং Cloudinary (25GB Free Bandwidth)।

---

## 🚀 লোকাল মেশিনে রান করার নিয়ম

```bash
# ১. রিপোজিটরি ক্লোন করুন বা ফোল্ডারে যান
cd "Digital TO-let bd"

# ২. ডিপেন্ডেন্সি ইনস্টল করুন (অলরেডি করা আছে)
npm install

# ৩. ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

ব্রাউজারে ওপেন করুন: `http://localhost:3000`

---

## 🔑 ফ্রি এনভায়রনমেন্ট ভ্যারিয়েবল সেটআপ (.env.local)

১. **MongoDB Atlas (Free 512MB):**
   - [mongodb.com/atlas](https://www.mongodb.com/atlas) এ গিয়ে ফ্রি অ্যাকাউন্ট তৈরি করে একটি Free M0 Cluster খুলুন।
   - "Connect" এ ক্লিক করে Connection String টি কপি করে `.env.local` ফাইলে বসান:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_tolet?retryWrites=true&w=majority
   ```

২. **Cloudinary (Free Image Hosting):**
   - [cloudinary.com](https://cloudinary.com) এ ফ্রি সাইন-আপ করে Dashboard থেকে API Keys কপি করে `.env.local` এ বসান:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 🌐 Vercel-এ ১০০% ফ্রিতে লাইভ করার নিয়ম

1. আপনার কোডগুলো [GitHub](https://github.com) এ একটি নতুন রিপোজিটরিতে পুশ করুন।
2. [vercel.com](https://vercel.com) এ লগইন করে **"Add New Project"** সিলেক্ট করুন।
3. আপনার GitHub রিপোজিটরি সিলেক্ট করে `Deploy` বাটনে চাপুন।
4. মাত্র ১ মিনিটের মধ্যে আপনার ওয়েবসাইটটি ইন্টারনেটে ফ্রি লাইভ লিংক পেয়ে যাবে (যেমন: `digital-tolet-bd.vercel.app`)!

---

## 👨‍💻 Developer & Founder

- **Ifrat Rahman Hamim**
- Department of Computer Science & Engineering (CSE)
- Canadian University of Bangladesh (CUB)
- ✉️ Email: `Ifratmirdha@gmail.com`
- 💬 WhatsApp: `01862228188`
