export interface DistrictData {
  name: string;
  bn: string;
  areas: { en: string; bn: string }[];
}

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  {
    name: "Dhaka",
    bn: "ঢাকা",
    areas: [
      { en: "Dhanmondi", bn: "ধানমন্ডি" },
      { en: "Mirpur", bn: "মিরপুর" },
      { en: "Gulshan", bn: "গুলশান" },
      { en: "Banani", bn: "বনানী" },
      { en: "Uttara", bn: "উত্তরা" },
      { en: "Mohammadpur", bn: "মোহাম্মদপুর" },
      { en: "Badda", bn: "বাড্ডা" },
      { en: "Bashundhara R/A", bn: "বসুন্ধরা আবাসিক" },
      { en: "Moghbazar", bn: "মগবাজার" },
      { en: "Shantinagar", bn: "শান্তিনগর" },
      { en: "Khilgaon", bn: "খিলগাঁও" },
      { en: "Lalmatia", bn: "লালমাটিয়া" },
      { en: "Rampura", bn: "রামপুরা" },
      { en: "Aftabnagar", bn: "আফতাবনগর" },
      { en: "Malibagh", bn: "মালিবাগ" },
      { en: "Jatrabari", bn: "যাত্রাবাড়ী" },
      { en: "Mohakhali", bn: "মহাখালী" },
      { en: "Tejgaon", bn: "তেজগাঁও" },
      { en: "Niketon", bn: "নিকেতন" },
      { en: "Baridhara", bn: "বারিধারা" },
      { en: "Farmgate", bn: "ফার্মগেট" },
      { en: "Old Dhaka", bn: "পুরান ঢাকা" },
      { en: "Azimpur", bn: "আজিমপুর" },
      { en: "Kalyanpur", bn: "কল্যাণপুর" },
      { en: "Shyamoli", bn: "শ্যামলী" },
    ],
  },
  {
    name: "Chattogram",
    bn: "চট্টগ্রাম",
    areas: [
      { en: "Agrabad", bn: "আগ্রাবাদ" },
      { en: "GEC Circle", bn: "জিইসি মোড়" },
      { en: "Nasirabad", bn: "নাসিরাবাদ" },
      { en: "Chawkbazar", bn: "চকবাজার" },
      { en: "Halishahar", bn: "হালিশহর" },
      { en: "Khulshi", bn: "খুলশী" },
      { en: "Muradpur", bn: "মুরাদপুর" },
      { en: "Bahaddarhat", bn: "বহদ্দারহাট" },
      { en: "Anderkilla", bn: "আন্দরকিল্লা" },
      { en: "Panchlaish", bn: "পাঁচলাইশ" },
    ],
  },
  {
    name: "Sylhet",
    bn: "সিলেট",
    areas: [
      { en: "Zindabazar", bn: "জিন্দাবাজার" },
      { en: "Amberkhana", bn: "আম্বরখানা" },
      { en: "Subidbazar", bn: "সুবিদবাজার" },
      { en: "Shibganj", bn: "শিবগঞ্জ" },
      { en: "Uposhahar", bn: "উপশহর" },
      { en: "Lamabazar", bn: "লামাবাজার" },
      { en: "Kumarpara", bn: "কুমারপাড়া" },
    ],
  },
  {
    name: "Rajshahi",
    bn: "রাজশাহী",
    areas: [
      { en: "Shaheb Bazar", bn: "সাহেব বাজার" },
      { en: "Motihar", bn: "মতিহার" },
      { en: "Kazihata", bn: "কাজীহাটা" },
      { en: "Upashahar", bn: "উপশহর" },
      { en: "Talaimari", bn: "তালাইমারী" },
      { en: "Laxmipur", bn: "লক্ষ্মীপুর" },
    ],
  },
  {
    name: "Khulna",
    bn: "খুলনা",
    areas: [
      { en: "Sonadanga", bn: "সোনাডাঙ্গা" },
      { en: "Boyra", bn: "বয়রা" },
      { en: "Khalishpur", bn: "খালিশপুর" },
      { en: "Daulatpur", bn: "দৌলতপুর" },
      { en: "Shibbari", bn: "শিববাড়ি" },
    ],
  },
  {
    name: "Barishal",
    bn: "বরিশাল",
    areas: [
      { en: "Sadar Road", bn: "সদর রোড" },
      { en: "Natun Bazar", bn: "নতুন বাজার" },
      { en: "Rupatoli", bn: "রূপাতলী" },
      { en: "Amtala", bn: "আমতলা" },
    ],
  },
  {
    name: "Rangpur",
    bn: "রংপুর",
    areas: [
      { en: "Jahaj Company", bn: "জাহাজ কোম্পানি মোড়" },
      { en: "Dhap", bn: "ধাপ" },
      { en: "Modern Mor", bn: "মডার্ন মোড়" },
      { en: "Park Mor", bn: "পার্ক মোড়" },
    ],
  },
  {
    name: "Mymensingh",
    bn: "ময়মনসিংহ",
    areas: [
      { en: "Ganginarpar", bn: "গাঙ্গিনারপাড়" },
      { en: "Chorpara", bn: "চরপাড়া" },
      { en: "Town Hall", bn: "টাউন হল" },
      { en: "Akua", bn: "আকুয়া" },
    ],
  },
];
