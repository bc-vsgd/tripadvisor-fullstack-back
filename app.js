const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Mailgun configuration
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Benoît",
  key: process.env.MAILGUN_API_KEY,
});

//Home
app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to Tripadvisor" });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
});

//Post
app.post("/form", async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;
    //Mail infos
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: process.env.MY_EMAIL,
      subject: "Tripadvisor contact form",
      text: message,
    };
    // Send mail
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN_NAME,
      messageData
    );
    console.log(response);
    // Response
    return res.status(201).json({ message: response });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
});

// All
app.all("*", (req, res) => {
  return res.status(404).json({ message: "Page not found ..." });
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
