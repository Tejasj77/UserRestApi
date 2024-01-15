import util from "util";
import { app } from "./../../src/app";
import { Db } from "./../../src/models/db";
import { IDbUtils } from "./../../src/config/mysql";
import request from "supertest";

const PORT = 3789;

let dbInst: IDbUtils | null;
let closeServer: () => Promise<void> | null;
let sharedData: any;
let dbResult: any;

beforeAll(async () => {
  dbInst = await Db.init("../src/data/schema.sql");
  await dbInst.query("delete from users");
  const server = app.listen(PORT);
  closeServer = util.promisify(server.close).bind(server);
});
beforeEach(async () => {
  if (dbInst) {
    dbResult = await dbInst.query("select * from users ");
    if (dbResult.length > 0) sharedData = dbResult;
  }
});
afterAll(async () => {
  if (dbInst) await dbInst.shutdown();
  if (closeServer) await closeServer();
});

describe("Users Controller", () => {
  test("get", async () => {
    const resp = await request(app)
      .get("/api/users")
      .expect("Content-Type", /json/);
    expect(resp.body).toEqual({
      message: "success",
      users: [],
    });
  });
  test("create", async () => {
    const resp = await request(app)
      .post("/api/users")
      .send({
        username: "Testing new user",
        age: 27,
        hobbies: [],
      })
      .expect("Content-Type", /json/);
    expect(resp.body).toMatchObject({
      user: [
        {
          username: "Testing new user",
          age: 27,
          hobbies: [],
        },
      ],
    });
  });
  test("get user", async () => {
    const resp = await request(app)
      .get(`/api/users/${sharedData[0].id}`)
      .expect("Content-Type", /json/);
    expect(resp.body).toEqual({
      message: "success",
      user: [
        {
          id: sharedData[0].id,
          username: "Testing new user",
          age: 27,
          hobbies: [],
        },
      ],
    });
  });
  test("put user", async () => {
    const resp = await request(app)
      .put(`/api/users/${sharedData[0].id}`)
      .send({
        username: "Testing new user",
        age: 101,
        hobbies: [],
      })
      .expect("Content-Type", /json/);
    expect(resp.body).toEqual({
      message: "success",
      user: [
        {
          id: sharedData[0].id,
          username: "Testing new user",
          age: 101,
          hobbies: [],
        },
      ],
    });
  });
  test("delete user", async () => {
    const resp = await request(app).delete(`/api/users/${sharedData[0].id}`);
    expect(resp.statusCode).toBe(204);
  });
  test("get deleted user", async () => {
    console.log({ sharedData });
    const resp = await request(app)
      .get(`/api/users/${sharedData[0].id}`)
      .expect("Content-Type", /json/);
    expect(resp.body).toEqual({ message: "User not found" });
  });
});
