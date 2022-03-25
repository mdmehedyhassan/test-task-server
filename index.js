const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("bitcoin_app");
        const bitcoinCollection = database.collection("bitcoin");

        app.put('/bitcoin', async (req, res) => {
            const getBitcoinData = req.body;
            const filter = { date: getBitcoinData?.date };
            const options = { upsert: true };
            const updateDoc = {
                $set: getBitcoinData,
            };
            const result = await bitcoinCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });

       

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})