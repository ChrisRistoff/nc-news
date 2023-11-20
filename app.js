const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const app = express();

app.use(express.json());

//topics
app.get("/api/topics", getAllTopics);

module.exports = app;
