//1.
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
//2.
const app = express();
app.use(cors());
app.use(express.json());

//3.
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luxos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//connect with db
async function run(){

    try{
        await client.connect();
        console.log('connected database');
        const database = client.db('hangout-Tour');
        const packagesCollection = database.collection('packages');
        const bookingCollection = database.collection('booking');
        const reviewCollection = database.collection('blogs');
      
        ///POST API
        app.post('/packages', async (req,res)=>{
            console.log(req.body);
            const package = req.body;
            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.send(result);
        })
        
        ///post for booking 
        app.post('/booking', async (req,res)=>{
            console.log(req.body);
            const booking = req.body;
            //const userEmail = booking.mail;
            //const query = {email : userEmail };
            const result = await bookingCollection.insertOne(booking)
            console.log(result);
            res.send(result);
        })

        ///post for blogs
        app.post('/reviews', async (req,res)=>{
            console.log(req.body);
            console.log('blog connected');
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.send(result);

        })
        //get my order
        app.get('/booking/:email',async(req,res)=>{
            const useremail = req.params.email;
            console.log(useremail);
            const query = {email : useremail}
            const result = await bookingCollection.find({email: req.params.email}).toArray();
            console.log(result)
            res.send(result)
        })

        ///get all orders
        app.get('/booking',async(req,res)=>{
            const cursor = bookingCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
            console.log('get success')
        })
         
        ///get reviews
        app.get('/reviews',async (req,res)=>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
            console.log('get success')
        })

    
        

        ///GET API
        app.get('/packages', async (req,res)=>{
            const cursor = packagesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
            console.log('get success')
        })
        ///get single service
        app.get('/packages/:id', async (req,res)=>{
            const id = req.params.id;
            console.log('single user success')
            const query = {_id : ObjectId(id)};
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })
         ///DELETE
         app.delete('/packages/:id', async (req,res)=>{
            const id= req.params.id; 
            console.log(id);
            const query = {_id : ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            console.log('delete hit')
            res.send(result)
            console.log(result)
        })
       

    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);



//4.
app.get('/',(req,res)=>{
    res.send('connected with server');
})

//5.
app.listen(port,()=>{
    console.log('listening from: ', port);
})

