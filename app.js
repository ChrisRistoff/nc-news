const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const { getDocs } = require("./documentation/docController");
const app = express();

app.use(express.json());

//docs
app.get("/api", getDocs)

//topics
app.get("/api/topics", getAllTopics);

module.exports = app;
