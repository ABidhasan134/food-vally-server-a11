const express = require("express");
const cors = require("cors");
require("dotenv").config();
// requireing mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

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
    app.get("/homefood", async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // food details get request for home page(single data)
    app.get("/foodsingledetails/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = await { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
      // console.log(result);
    });
    // available data get request for (available page)
    app.get("/availablefood", async (req, res) => {
      const status = req.query.status;
      const query = { 
        Food_Status: status };
      const result = await foodCollection.find(query).toArray();
      // console.log(status);
      res.send(result);
    });
    // spacicfic data search get request for available search oparation
    app.get("/searchfood", async (req, res) => {
      const searchQuery = req.query.Food_Name;
      const status = req.query.status;
      // console.log(status);
      //  allows you to perform a regular expression search. In this case, it's used to specify the pattern to match against the Food_Name field.
      // i="case-insensitive" (meaning the search will be performed without considering the case of the letters.)
      const query = {
        Food_Name: { $regex: searchQuery, $options: "i" },
        Food_Status: status,
      };
      const result = await foodCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });
    // all data get api end
    // update document in mongodb
    app.patch("/requsest/:id", async (req, res) => {
      const updateInfo = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          Expired_Date: updateInfo.Expired_Date,
          Food_Status: updateInfo.Food_Status,
          Additional_Info: updateInfo.Food_AddtonalInfo,
          Food_requestDate: updateInfo.Food_requestDate,
        },
      };
       // Update the document
      const result = await foodCollection.updateOne(filter, updateDoc);
      // If Food_Status is no longer 'available', remove it from the 'available' list
      if (updateInfo.Food_Status !== 'available') {
        const removeQuery = { _id: new ObjectId(id),Food_Status: 'available' };
        const result2= await foodCollection.updateOne(removeQuery, { $unset: { Food_Status: 1 } });
        res.send(result2);
    }
      // console.log(result);
    });
    // requested food api
    app.get("/request", async (req, res) => {
      const status = req.query.status;
      const query = { 
        Food_Status: status };
      // console.log(status);
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/managefood",async(req,res)=>{
      const email=req.query.email;
      console.log(email);
      const query = {"Donator_Info.email" : email };

      const result = await foodCollection.find(query).toArray();
      res.send(result);

    })
    // post requst in same data base and same collection
    app.post("/addData", async (req, res) => {
      const info = req.body;
      const result = await foodCollection.insertOne(info);
      // console.log(info)
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);
app.listen(port, () => {
  console.log(`Resturent is high in the Rocket ${port}`);
});
