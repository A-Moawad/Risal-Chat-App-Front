import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkClient } from "@clerk/express";

// Load environment variables
dotenv.config();

const { CLERK_SECRET_KEY } = process.env;
if (!CLERK_SECRET_KEY) {
  console.error("❌ Missing CLERK_SECRET_KEY in environment variables.");
  process.exit(1); // Exit if Clerk API key is missing
}

const app = express();

app.use(cors());
app.use(express.json());

// Create a new user in Clerk
app.post("/user", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await clerkClient.users.createUser({
      emailAddress: [email],
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
});

// Delete an email from a user's account
app.delete("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Delete the user
    await clerkClient.users.deleteUser(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Failed to delete user", details: error.message });
  }
});

//  Update a user's primary email
app.put("/", async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ error: "User ID and email are required" });
    }

    // Get user details
    const userData = await clerkClient.users.getUser(userId);

    // Find the email ID
    const emailData = userData.emailAddresses.find(
      (emailObj) => emailObj.emailAddress === email
    );

    if (!emailData) {
      return res.status(404).json({ error: "Email not found for the user" });
    }

    // Set the email as primary
    const updatedEmail = await clerkClient.emailAddresses.updateEmailAddress(
      emailData.id,
      { primary: true }
    );

    res.status(200).json({ message: "Primary email updated", updatedEmail });
  } catch (error) {
    console.error("❌ Error updating primary email:", error);
    res
      .status(500)
      .json({ error: "Failed to update email", details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
