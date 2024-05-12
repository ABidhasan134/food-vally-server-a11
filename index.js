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
// console.log(process.env.DB_USER,process.env.DB_PASSWORD)
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
    
    // all data get api start for Home page (all data)
    app.get('/homefood',async(req,res)=>{
      const cursor=foodCollection.find();
      const result= await cursor.toArray();
      res.send(result);
  })
// food details get request for home page(single data)
    app.get('/foodsingledetails/:id',async(req,res)=>{
      const id=req.params.id;
      // console.log(id);
      const query=await {_id: new ObjectId(id)}
      const result= await foodCollection.findOne(query)
      res.send(result);
      // console.log(result);
    })
    // available data get request for (available page)
      app.get("/availablefood",async(req,res)=>{
        const status=req.query.status;
        const query={status:status}
        const result= await foodCollection.find(query).toArray();
        // console.log(result);
        res.send(result)
      })
// spacicfic data search get request for available search oparation 
      app.get("/searchfood",async(req,res)=>{
        const searchQuery = req.query.Food_Name;
        console.log(searchQuery);
        //  allows you to perform a regular expression search. In this case, it's used to specify the pattern to match against the Food_Name field.
        // i="case-insensitive" (meaning the search will be performed without considering the case of the letters.)
        const query = { Food_Name: { $regex: searchQuery, $options: 'i' } };
        const result = await foodCollection.find(query).toArray();
        // console.log(result);
        res.send(result);
      })
    // all data get api end
    // post requst in same data base and same collection
    app.post("/addData",async(req,res)=>{
      const info=req.body;
      const result= await foodCollection.insertOne(info)
      // console.log(info)
      res.send(result);
    })

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
