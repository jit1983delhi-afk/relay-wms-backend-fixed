import fetch from "node-fetch";

const BASE = "https://relay-wms-backend-fixed.onrender.com";

const users = [
  { name: "Bengaluru", email: "twbpblr@gmail.com", password: "blrtwbp@2025", role: "warehouse", whid: "BLR" },
  { name: "Bhiwandi", email: "bhoir.vijay@gmail.com", password: "bwdntwbp@2025", role: "warehouse", whid: "BWDN" },
  { name: "Chennai", email: "vdillibabu001@gmail.com", password: "chntwbp@2025", role: "warehouse", whid: "CHN" },
  { name: "Gurgaon", email: "hareramthakur91@gmail.com", password: "ggntwbp@2025", role: "warehouse", whid: "GGN" },
  { name: "Hyderabad", email: "twbp.phyderabad123@gmail.com", password: "hydtwbp@2025", role: "warehouse", whid: "HYD" },
  { name: "Kolkata", email: "bikashghosh2916@gmail.com", password: "koltwbp@2025", role: "warehouse", whid: "KOL" },
  { name: "Lucknow", email: "gauravlkohcl@gmail.com", password: "lkotwbp@2025", role: "warehouse", whid: "LKO" },
  { name: "Patna", email: "patna.bm@relayexpress.in", password: "pattwbp@2025", role: "warehouse", whid: "PAT" },
  { name: "Noida", email: "noidarelay@gmail.com", password: "noitwbp@2025", role: "warehouse", whid: "NOI" },
  { name: "TWBP Admin", email: "admin@twbpinternational.com", password: "admintwbp@2025", role: "admin", whid: "ADMIN" }
];

async function seedUsers() {
  console.log("🚀 Starting user registration for TWBP Warehouses...\n");

  for (const user of users) {
    try {
      const res = await fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`✅ Registered: ${user.email}`);
      } else {
        console.log(`⚠️  Failed: ${user.email}`);
        console.log(`   Error: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.log(`❌ Error for ${user.email}: ${err.message}`);
    }
  }

  console.log("\n🎯 All users processed.");
}

seedUsers();
