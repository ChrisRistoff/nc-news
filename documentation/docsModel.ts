import fs from "fs/promises";

export const getDocsModel = async () => {
  const ENV = process.env.NODE_ENV;
  let path: string;

  if (ENV === "test") {
    path = `${__dirname}/../endpoints.json`;
  } else {
    path = `${__dirname}/../../endpoints.json`;
  }

  const docs = await fs.readFile(path, "utf-8");

  return JSON.parse(docs);
};
