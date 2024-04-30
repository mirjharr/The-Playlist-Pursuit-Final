const express = require("express");
const cors = require("cors");
const app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const { MongoClient } = require("mongodb");
// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "playlistPursuit";
const client = new MongoClient(url);
const db = client.db(dbName);
//app.use(express.static("public"));
//app.use("/images", express.static("images"));
const port = "8081";
const host = "localhost";

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

// Connect to MongoDB
client.connect();

//Route to get all posts
app.get("/playlists", async (req, res) => {
    try {
        await client.connect();
        console.log("Node connected successfully to GET MongoDB");
        const query = {};
        const results = await db.collection("playlists").find(query).limit(100).toArray();
        console.log(results);
        res.status(200).send(results); // Send the results as the response
    } catch (err) {
        // If an error occurs, catch it and send an appropriate error response
        console.error("Error in Reading mongo :", err);
        res.status(500).send({ error: 'An error occurred while fetching items.' });
    }
});

app.get("/playlists/:emotion", async (req, res) => {
    try {
        // Read id from frontend
        const emotion = req.params.emotion;
        console.log(`Object to find: ${emotion}`);
        await client.connect();
        console.log("Node connected successfully to GET-id MongoDB");
        const query = { "emotion": `${emotion}` };
        const results = await db.collection("playlists").findOne(query);
        console.log("Results :", results);
        res.status(200).send(results);
    } catch (err) {
        // If an error occurs, catch it and send an appropriate error response
        console.error("Error in Reading mongo :", err);
        res.status(500).send({ error: 'An error occurred while fetching items.' });
    }
});

// app.get("/playlists/:category", async (req, res) => {
//     try {
//         // Read id from frontend
//         const category = req.params.category;
//         const query = "SELECT * FROM playlists WHERE category = ?";
//         const [result] = await db.query(query, [category]); // Ensure to use array for parameters even if it's just one
//         console.log("Success in Reading MySQL");
//         res.status(200).send(result);
//     } catch (err) {
//         // If an error occurs, catch it and send an appropriate error response
//         console.error("Error in Reading MySQL :", err);
//         res.status(500).send({ error: 'An error occurred while fetching items.' });
//     }
// });

// Assuming `db` is from mysql2/promise
app.post("/playlists", async (req, res) => {
    try {
        await client.connect();
        // Validate if body contains data
        if (!req.body || Object.keys(req.body).length === 0) {
            const msg = "POST: Bad request: No data provided.";
            console.log(msg);
            return res.status(400).send({ error: msg });
        }

        // Check if the table exists
        const collection = db.collection("playlists");
        // const tableExists = await collection.exists();
        // if (!tableExists) {
        //     const msg = "POST: Table does not exist";
        //     console.log(msg);
        //     return res.status(404).send({ error: msg });
        // }

        // Check if the product exists
        const itemId = req.body.id;
        const productExists = await collection.findOne({ id: itemId });
        if (productExists) {
            // Item exists
            const msg = "POST: Item already exists";
            console.log(msg);
            return res.status(409).send({ error: msg });
        }

        // Proceed to add new item
        const newDocument = {
            "id": Number(req.body.id),
            "emotion": req.body.emotion,
            "description": req.body.description,
            "embeddedHtml": req.body.embeddedHtml
        };

        const insertResult = await collection.insertOne(newDocument);
        const msg = "POST: Success in Posting MySQL" + insertResult;
        console.log(msg);
        return res.status(200).send({ success: msg });

    } catch (err) {
        // Handle any error
        const msg = "POST: An ERROR occurred in Post: " + err.message;
        console.error(msg);
        res.status(500).send({ error: msg });
    }
});


app.put("/playlists/:id", async (req, res) => {
    try {
        await client.connect();
        // Validate if body contains data
        if (!req.body || Object.keys(req.body).length === 0) {
            const msg = "PUT: Bad request: No data provided.";
            console.log(msg);
            return res.status(400).send({ error: msg });
        }

        // Proceed to update the existing item
        const id = Number(req.params.id);
        const filter = { id: id }; // Filter to find the document by its ID
        const update = { $set: req.body};          
        console.log(filter)
        console.log(update)
        const updateResult = await db.collection("playlists").updateOne(filter, update);
        if (updateResult) {
            // Success: Document updated
            console.log(updateResult);
            const msg = "PUT: Success in updating document in MongoDB";
            console.log(msg);
            return res.status(200).send({ success: msg });
        } else {
            // Document not found or not updated
            const msg = "PUT: Document not found or not updated";
            console.log(msg);
            return res.status(404).send({ error: msg });
        }
    } catch (err) {
        // Handle any error
        const msg = "PUT: An ERROR occurred: " + err.message;
        console.error(msg);
        res.status(500).send({ error: msg });
    }
});

// Route to delete a post
app.delete("/playlists/:id", async (req, res) => {
    try {
        await client.connect();
        // Read id from frontend
        const itemId = Number(req.params.id);
        const stringId = String(req.params.id)
        // Proceed to delete item
        const filter = { id: itemId };
        const filterString = { id: stringId };

        // Verify if item exists
        const productExists = await db.collection("playlists").findOne(filter);
        const productExists2 = await db.collection("playlists").findOne(filterString);

        if (!productExists && !productExists2) {
            // Item does NOT exist
            const msg = `DELETE: Item ${itemId} does NOT exist`;
            console.log(msg);
            return res.status(404).send({ error: msg });
        }

        // Proceed to delete it
        const results = await db.collection("playlists").deleteOne(filter);
        const results2 = await db.collection("playlists").deleteOne(filterString);
        const msg = `Success in DELETE item: ${itemId}`;
        console.log(msg);
        return res.status(200).send({ success: msg });
    } catch (err) {
        // Handle any error
        const msg = `DELETE: An ERROR occurred in Delete: ${err}`;
        console.error(msg);
        return res.status(500).send({ error: msg });
    }
});