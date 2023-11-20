const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const { getDocs } = require("./documentation/docController");
const { getAllArticles } = require("./controllers/articlesController");
const app = express();

app.use(express.json());

//docs
app.get("/api", getDocs)

//topics
app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles)
module.exports = app;
