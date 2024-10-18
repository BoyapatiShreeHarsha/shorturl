import express from "express";
import { Request, Response, NextFunction } from "express-serve-static-core";
import cookieParser from "cookie-parser";
import cors from "cors";
import shortenRouter from "./shorten-router";

const corsOptions: cors.CorsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
};

export function createApp() {
  const app = express();

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.set("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("X-Frame-Options", "DENY");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.raw({ type: "application/octet-stream", limit: "100mb" }));
  app.use(cookieParser());
  app.use(cors(corsOptions));

  // routes
  app.use("/shorten", shortenRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.log("Error in the global catch==========>>>>");
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  });

  return app;
}
