import express, { Request, Response, NextFunction } from "express";
import { Db } from "../models/db";
import * as uuid from "uuid";

export function getUserRouter() {
  return express
    .Router({ mergeParams: true })
    .get("/", getUserList)
    .get("/:userId", getUserData)
    .post("/", createUser)
    .put("/:userId", updateUserData)
    .delete("/:userId", deleteUserData);
}

async function getUserList(req: Request, res: Response) {
  const users = await Db.users.getAll();
  res.status(200).send({ message: "success", users: users || [] });
}

async function getUserData(req: Request, res: Response) {
  const { userId } = req.params;
  if (!uuid.validate(userId)) {
    res.status(400).send({ message: "uuid is invalid" });
  }
  try {
    const user = await Db.users.getUser(userId);
    if (user) {
      res.status(200).send({ message: "success", user });
    } else res.status(404).send({ message: "User not found" });
  } catch (e) {
    res.status(404).send({ message: "User not found" });
  }
}

async function updateUserData(req: Request, res: Response) {
  const { userId } = req.params;
  if (!uuid.validate(userId)) {
    res.status(400).send({ message: "uuid is invalid" });
  }
  const { username, age, hobbies } = req.body;
  try {
    const user = await Db.users.updateUser({
      id: userId,
      username,
      age: parseInt(age, 10),
      hobbies,
    });
    res.status(200).send({ message: "success", user });
  } catch (e) {
    res.status(404).send({ message: "User not found" });
  }
}

async function createUser(req: Request, res: Response) {
  const { username, age, hobbies } = req.body;
  const userId = uuid.v4();
  if (
    !(username && typeof username === "string" && age && Array.isArray(hobbies))
  ) {
    res.status(400).send({ message: "User details are invalid. Please check" });
  }
  try {
    const row = await Db.users.insertUser({
      id: userId,
      username,
      age: parseInt(age, 10),
      hobbies,
    });
    res.status(201).send({ user: row, message: "User created successfully" });
  } catch (e: any) {
    if (e.code === "ER_DUP_ENTRY") {
      res.status(409).send({ message: "User already exists" });
    }
  }
}

async function deleteUserData(req: Request, res: Response) {
  const { userId } = req.params;
  if (!uuid.validate(userId)) {
    res.status(400).send({ message: "uuid is invalid" });
  }
  try {
    const row = await Db.users.deleteUser(userId);
    if (!row) res.status(404).send({ message: "User does not exist" });
    res.status(204).send();
  } catch (e) {
    res.status(404).send({ message: "User does not exist" });
  }
}
