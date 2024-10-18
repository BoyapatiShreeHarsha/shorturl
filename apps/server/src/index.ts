import express from "express";
import { fileURLToPath } from "url";
import path from "path";
// import { Url } from "@shorturl/types";
import { createApp } from "./create-app";
import connectDB from "./connect-db";

declare module "express-serve-static-core" {
  interface Request {}
}

const app = createApp();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../dist/client")));

// Handle any other routes and send them to the frontend
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist/client", "index.html"));
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Http server running at port", port);
});
