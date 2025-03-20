import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import morgan from "morgan";
import Routes from "./routes";
import bodyparser from "body-parser";
import { Server as HttpServer } from "http";
import { AppDataSource } from "./config/database.config";
import express, { NextFunction, Request, Response } from "express";

dotenv.config();

const app = express();
const port = 3001;

const httpServer = new HttpServer(app);

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

const setGlobalOriginHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
};

app.use(setGlobalOriginHeader);

app.use("/api/v1", Routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Stage Server Running");
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database Connected successfully");
    httpServer.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization", error);
  }
})();
