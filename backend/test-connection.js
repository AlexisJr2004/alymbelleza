// test-connection.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://snietod:kLSSYgP2D4wmS59m@bellabeauty.y61attk.mongodb.net/?retryWrites=true&w=majority&appName=bellaBeauty";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ ¡Conexión exitosa a MongoDB!");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
