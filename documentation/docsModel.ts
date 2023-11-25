import fs from "fs/promises"

export const getDocsModel = async () => {
  const docs = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")

  // @ts-ignore
  return JSON.parse(docs, null, 2)
}
