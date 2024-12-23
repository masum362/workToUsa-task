const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

// Create an express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to handle POST requests to /launches
async function postLaunchData(launchData) {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(launchData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error posting launch data:", error.message);
      throw error;
    }
  }

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
