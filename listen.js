const app = require("./app")
const { PORT = 80 } = process.env;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
