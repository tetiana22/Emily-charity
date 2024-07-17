import fs from "fs/promises";
import path from "path";

const swaggerPath = path.join("./", "swagger.json");
const swaggerDocs = async () =>
  JSON.parse(await fs.readFile(swaggerPath, "utf-8"));

export default swaggerDocs;
