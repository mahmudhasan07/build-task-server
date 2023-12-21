const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2000
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.send('Welcome to My Server Side')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Build-Task:KH0RtFrOdHO0zSI1@cluster0.oqk84kq.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();
        const taskDB = client.db("Build-Task").collection('tasks')
        const takeTaskDB = client.db("Build-Task").collection('takeTasks')


        app.get('/tasks', async (req, res) => {
            let query = {}
            const data = req.query
            // console.log(data);
            if (data?.data) {
                query = { createby: data?.data }
            }
            const result = await taskDB.find(query).toArray()
            res.send(result)
        })

        app.get(`/tasks/:id`, async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await taskDB.findOne(query)
            res.send(result)
        })

        app.get('/taketasks', async (req, res) => {
            const result = await takeTaskDB.find().toArray()
            res.send(result)
        })

        app.post('/tasks', async (req, res) => {
            const task = req.body
            const result = await taskDB.insertOne(task)
            res.send(result)
        })
        app.post('/taketasks', async (req, res) => {
            const data = req.body
            const result = await takeTaskDB.insertOne(data)
            res.send(result)
        })

        app.put(`/tasks`, async (req, res) => {
            const data = req.body
            console.log(data);
            const filter = { _id: new ObjectId(data?.id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    tittle: data.tittle, description: data.description, deadline: data.deadline, image: data.image, level: data.level
                },
            };
            const result = await taskDB.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})