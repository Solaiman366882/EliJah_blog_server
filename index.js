const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// using Middleware
app.use(cors());
app.use(express.json());

// ************************ MongoDB Connection and Operation Start **************************

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ea4znei.mongodb.net/?retryWrites=true&w=majority`;

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
		// Connect the client to the server	(optional starting in v4.7)
		//await client.connect();

		// ************************* Database Operation Start **************************

		const database = client.db("elijahBlogDB");
		const blogCollection = database.collection("blogs");
		const newsletterCollection = database.collection("newsletter");
		const wishlistCollection = database.collection("wishlist");
		const commentCollection = database.collection("comments");

		//post a single blog
		app.post("/blogs", async (req, res) => {
			const newBlog = req.body;
			const result = await blogCollection.insertOne(newBlog);
			res.send(result);
		});

		//add a single comment to database
		app.post("/comments", async (req, res) => {
			const newComments = req.body;
			const result = await commentCollection.insertOne(newComments);
			res.send(result);
		});

		//get specific blog comments
		app.get("/comments", async (req, res) => {
			let query = {};
			if (req.query?.blog_id) {
				query = {
					blog_id: req.query.blog_id,
				};
			}
			const cursor = commentCollection.find(query);
			const result = await cursor.toArray();
			res.send(result);
		});

		//get all blogs data
		app.get("/blogs", async (req, res) => {
			const cursor = blogCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		//get a single blog using id
		app.get("/blog/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await blogCollection.findOne(query);
			res.send(result);
		});

		//Update a single Blog
		app.put("/blog/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updateInfo = req.body;
			const updatedBlog = {
				$set: {
					title: updateInfo.title,
					blogImg: updateInfo.blogImg,
					shortDescription: updateInfo.shortDescription,
					category: updateInfo.category,
					description: updateInfo.description,
				},
			};
			const result = await blogCollection.updateOne(
				filter,
				updatedBlog,
				options
			);
			res.send(result);
		});

		//make newsletter user
		app.post("/newsLetter", async (req, res) => {
			const newsletterUser = req.body;
			const result = await newsletterCollection.insertOne(newsletterUser);
			res.send(result);
		});
		//add to users wishlist
		app.post("/wishlist", async (req, res) => {
			const wishedBlog = req.body;
			const result = await wishlistCollection.insertOne(wishedBlog);
			res.send(result);
		});
		//get users wishlist blogs
		app.get("/wishlist", async (req, res) => {
			let query = {};
			if (req.query?.email) {
				query = {
					wishlistOwner: req.query.email,
				};
			}
			const cursor = wishlistCollection.find(query);
			const result = await cursor.toArray();
			res.send(result);
		});

		//Delete a single Wishlist
		app.delete("/wishlist/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await wishlistCollection.deleteOne(query);
			res.send(result);
		});

		// ************************* Database Operation End **************************

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
}
run().catch(console.dir);

// ************************ MongoDB Connection and Operation End **************************

//default setting for start the server
app.get("/", (req, res) => {
	res.send("Elijah Blog server is Running.");
});
app.listen(port, () => {
	console.log(`Elijah server is running on port: ${port}`);
});
