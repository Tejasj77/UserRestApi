import express from "express";
import { getUserRouter } from "../controller/users";

const Router = express.Router();
Router.use("/api/users", getUserRouter());

export default Router;
