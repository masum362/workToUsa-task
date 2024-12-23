const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

// Create an express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
