const express = require('express');
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// using Middleware
app.use(cors());
app.use(express.json());

//default setting for start the server
app.get('/',(req,res) => {
    res.send("Elijah Blog server is Running.");
})
app.listen(port,() => {
    console.log(`Elijah server is running on port: ${port}`);
})