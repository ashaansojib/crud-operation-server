const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 9988;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('the main server is running')
});

const uri = `mongodb+srv://${process.env.USERNAME_KEY}:${process.env.PASSWORD_KEY}@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a db and collection
    const crudOperation = client.db('crud-method').collection('cruds');
    // show data from the mongodb
    app.get('/cruds', async(req, res)=>{
        const cursor = await crudOperation.find().toArray();
        res.send(cursor)
    })
    // get data from client site
    app.post('/cruds', async(req, res)=>{
        const crudMethods = req.body;
        console.log(crudMethods)
        const result = await crudOperation.insertOne(crudMethods);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log('the server is running on: ', port)
});