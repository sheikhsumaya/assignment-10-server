const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const res = require("express/lib/response");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6w3c6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const dataCollection = client.db("Books").collection("data");

    app.get("/data", async (req, res) => {
      const query = {};
      const cursor = dataCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });


    app.get('/data/:id', async(req, res) =>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)};
      const data = await dataCollection.findOne(query);
      res.send(data);
    });

    // POST

    app.post('/data', async(req, res) =>{
      const newData = req.body;
      const result = await dataCollection.insertOne(newData);
      res.send(result);
    });

    // DELETE
    app.delete('/data/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await dataCollection.deleteOne(query);
      res.send(result);
    });


  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Book Server");
});


app.listen(port, () => {
  console.log("Listening to port", port);
});
