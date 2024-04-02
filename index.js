const express = require('express')
const app = express()
const port = process.env.PORT || 5000 
const cors = require('cors')


//middleware[NuBkYtihRAvhJp0T] 
app.use(cors())
app.use(express.json());


//paste monogodb coniguration code

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://book-store:NuBkYtihRAvhJp0T@atlascluster.jl5jvvj.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

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

  //create a db collection to documents
  const bookCollections = client.db("BookInventory").collection("books");

  //insert a book to the db: post method to post data to database
  app.post("/upload-book",async(req,res)=>{
    const data = req.body;
    const result =await bookCollections.insertOne(data);
    res.send(result);
  })

  // //get all books from database
  // app.get("/all-books",async(req, res)=>{
  //   const books = await bookCollections.find().toArray();
  //   // const result = await books.toArray();
  //   res.send(books);
  // })

  //update a book data : patch or update methods
  app.patch("/book/:id", async (req, res) => {
    const id = req.params.id;
    const updateBookData = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            ...updateBookData
        }
    };
// update operation in a try-catch block
    try {
        const result = await bookCollections.updateOne(filter, updateDoc);
        res.json(result);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: "An error occurred while updating the book" });
    }
});

//delete a book data
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await bookCollections.deleteOne(filter);
  res.send(result);
})

//find book by category
app.get("/all-books", async (req, res) =>{
  let query ={};
  if(req.query?.category){
    query = {category: req.query.category}
  }
  const result = await bookCollections.find(query).toArray();
  res.send(result);
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); it will close the db when our code finished thts why i commented
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})