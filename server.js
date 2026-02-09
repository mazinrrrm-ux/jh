const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = 5000;

// Middleware لتحويل JSON وقراءة بيانات النماذج
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تقديم ملفات HTML من مجلد "public"
app.use(express.static(path.join(__dirname, "public")));

// رابط الاتصال بـ MongoDB Atlas
const uri = "mongodb+srv://zorba2003:osama603121@zorba2003.ijiuge7.mongodb.net/zorba2003?retryWrites=true&w=majority&appName=zorba2003";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const database = client.db("zorba2003");
    const users = database.collection("users");

    // استقبال البيانات من النموذج
    app.post("/add-user", async (req, res) => {
      const { name, role } = req.body;
      const result = await users.insertOne({ name, role });
      res.send(`<p>✅ تمت إضافة المستخدم بنجاح! ID: ${result.insertedId}</p>
                <a href="/">رجوع</a>`);
    });

    // عرض جميع المستخدمين
    app.get("/users", async (req, res) => {
      const allUsers = await users.find().toArray();
      let html = "<h1>📋 قائمة المستخدمين</h1><ul>";
      allUsers.forEach(u => {
        html += `<li>${u.name} - ${u.role} (ID: ${u._id})</li>`;
      });
      html += "</ul><a href='/'>رجوع</a>";
      res.send(html);
    });

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

main();
