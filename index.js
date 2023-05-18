const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app= express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rvg3x0p.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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

    const toyCarCollection = client.db('toyCarHubDB').collection('toyCar')
    const categoryCollection = client.db('toyCarHubDB').collection('toyCategory')

    app.get('/allToys', async(req, res)=>{
      const result = await toyCarCollection.find().toArray()
      res.send(result)
    })

    app.get('/categoryToy', async(req, res)=>{
      const result = await categoryCollection.find().toArray()
      res.send(result)
    })

    app.get('/allToys/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await toyCarCollection.findOne(query)
      res.send(result)
    })

app.post('/addToys', async(req, res)=>{
  const body = req.body
  console.log(body)
  const result = await toyCarCollection.insertOne(body)
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
        res.send('toy car server is running')
})

app.listen(port, ()=>{
        console.log(`toy car server is running on port ${port}`)
})