const fs = require("fs/promises")

exports.getDocsModel = async () => {
  const docs = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")

  return JSON.parse(docs, null, 2)
}
