data = {
  "GET /api" : {
    "description": "Returns a json object with all the available endpoints of the API"
  },
  "GET /api/topics": {
    "description": "Returns an array of all topics",
    "queries": [],
    "exampleResponse": {
      "topics": [{"slug": "databases", "description": "should we use an ORM or raw SQL"}]
    }
  }
}

module.exports = data
