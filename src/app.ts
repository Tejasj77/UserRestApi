import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import homeRouter from "./router/homeRouter";
import path from "path";

export const app: Application = express();
/** Logging the request */
app
  /** Views */
  .use(express.static(path.join(__dirname, "public")))
  /** Body Parsing */
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  /** Roules of API */
  .use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST PUT");
      return res.status(200).json({});
    }
    next();
  })
  /** Routes */
  .use("/", homeRouter)
  /** Error Handling */
  .use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error("Not Found");

    return res.status(404).json({
      message: err.message,
    });
  })
  .use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
  });
