import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import swaggerOptions from "../src/config/swagger.js";

const __dirname = path.resolve();
const outputPath = path.join(__dirname, "swagger-output.json");

const swaggerSpec = swaggerJSDoc(swaggerOptions);

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

