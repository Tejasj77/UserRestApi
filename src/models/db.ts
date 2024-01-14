import util from "util";
import logger from "../logger";
import { initMySQLconnection } from "../config/mysql";
import { Users } from "./Users";

export class Db {
  static users: Users;
  static async init(schemaFile?: string) {
    logger.info("[DATABASE]", "Initializing Database");
    const dbConn = await initMySQLconnection(schemaFile);
    Db.users = new Users(dbConn);
    return dbConn;
  }
}

const Query = async (connection: any, query: string) => {
  const connectPr = util.promisify(connection.connect).bind(connection);
  const queryPr = util.promisify(connection.query).bind(connection);
  const endPr = util.promisify(connection.end).bind(connection);
  const result = await queryPr(query);
  await endPr();
  return result;
};

export { Query };
