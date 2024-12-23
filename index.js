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
      body: JSON.stringify({
        title: `${launchData.missionName} Launch`,
        body: `Rocket: ${launchData.rocketName}, Launch Date: ${launchData.launchDate}`,
        userId: 1,
      }),
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

// Function to handle retries for recoverable errors.
async function retryWithBackoff(postFn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await postFn();
    } catch (error) {
      // Skip retry for 403 errors
      if (error.message.includes("403")) {
        console.log("Skipping retry for 403 error");
        throw error;
      }

      // On last retry, throw the error
      if (i === maxRetries - 1) throw error;

      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Express route to handle launch data submission
app.post("/api/launches", async (req, res) => {
  try {
    const launchData = req.body;
    // Validate required fields
    if (
      !launchData.missionName ||
      !launchData.rocketName ||
      !launchData.launchDate
    ) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide missionName, rocketName, and launchDate.",
      });
    }

    // Post the launch data
    const result = await retryWithBackoff(() => postLaunchData(launchData));

    res.status(201).json({
      message: "Launch data posted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    if (error.message.includes("403")) {
      res.status(403).json({ error: "Access forbidden" });
    } else if (error.message.includes("500")) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
