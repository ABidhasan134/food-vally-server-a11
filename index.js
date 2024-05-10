const express = require("express");
const cors = require("cors");
require('dotenv').config()
// requireing mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin:["http://localhost:5173"],
    credentials: true,
  }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Resturent is high in the Rocket");
});
console.log(process.env.DB_USER,process.env.DB_PASSWORD)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.il352b3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const database = client.db("foodvally");
    const foodCollection = database.collection("food");
    
    // all data get api start
    app.get('/availablefood',async(req,res)=>{
      const cursor=foodCollection.find();
      const result= await cursor.toArray();
      res.send(result);
  })
    // all data get api end

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
  }
}

run().catch(console.dir);
app.listen(port, () => {
  console.log(`Resturent is high in the Rocket ${port}`);
});
