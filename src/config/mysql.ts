import fs from "fs";
import mysql from "mysql";
import config from "./config";
import util from "util";
import stream from "stream";
import { keyToCamelCase } from "../utils/mysql-utils";

let params = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.db,
  port: config.mysql.port,
  multipleStatements: true,
};

const readFile = util.promisify(fs.readFile);
function toCamelCase(row: any) {
  const mod: any = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (chars) =>
      chars[1].toUpperCase()
    );
    mod[camelKey] = row[key];
  }
  return mod;
}

interface QueryResponse {
  fieldCount?: number;
  affectedRows?: number;
  insertId?: number;
  changedRows?: number;
}

export interface IDbUtils {
  query(sql: string, param?: any[]): Promise<QueryResponse>;
  getRows(sql: string, param?: any[]): Promise<any[]>;
  stream(sql: string, param?: any[]): stream.Readable;
  transaction(txnFunction: Function): Promise<any>;
  shutdown(): Promise<void>;
}

const cleanSQL = (sql: string) => sql.replace(/[\s\n]+/g, " ").trim();

export async function initMySQLconnection(schemaFile?: string) {
  const schemaSQL = await readFile(
    schemaFile || "./src/data/schema.sql",
    "utf-8"
  );
  const conn = mysql.createConnection(params);
  const connectPr = util.promisify(conn.connect).bind(conn);
  const queryPr = util.promisify(conn.query).bind(conn);
  const endPr = util.promisify(conn.end).bind(conn);
  await connectPr();
  await queryPr(schemaSQL);
  await endPr();

  const myPool = mysql.createPool(params);
  const getConnectionPr = util.promisify(myPool.getConnection).bind(myPool);
  const qPr = (sql: string, param: any[] = []) =>
    new Promise<any>((resolve, reject) => {
      myPool.query(sql, param, (error, rowsOrResult, fields) => {
        if (error) reject(error);
        else {
          const jsonFields = fields
            ? fields.filter((f) => f.type === 245).map((f) => f.name)
            : [];
          const out =
            Array.isArray(rowsOrResult) && jsonFields
              ? rowsOrResult.map((r: any) => {
                  const record = { ...r };
                  jsonFields.forEach((jf) => {
                    const jsonStr = r[jf];
                    record[jf] = jsonStr ? JSON.parse(jsonStr) : jsonStr;
                  });
                  return record;
                })
              : rowsOrResult;
          resolve(out);
        }
      });
    });
  const query = async (sql: string, param?: any[]) => {
    return qPr(sql, param);
  };
  const getRows = async (sql: string, param?: any[]) => {
    const result = await qPr(sql, param);
    return result.map(toCamelCase);
  };
  const stream = (sql: string, param?: any[]) => {
    return myPool.query(sql, param).stream();
  };
  const transaction = async (txnFunction: Function) => {
    const myConn = await getConnectionPr();
    const beginTx = util.promisify(myConn.beginTransaction).bind(myConn);
    const commitTx = util.promisify(myConn.commit).bind(myConn);
    const rollbackTx = util.promisify(myConn.rollback).bind(myConn);
    try {
      const txQueryPr = (sql: any, params = []): Promise<any> => {
        if (config.isDev) console.log(`SQL: ${cleanSQL(sql)}`, { params });
        return new Promise((resolve, reject) => {
          myConn.query(sql, params, (error, rowsOrResult, fields) => {
            if (error) reject(error);
            else if (Array.isArray(rowsOrResult))
              resolve(fixRows(rowsOrResult, fields));
            else resolve(rowsOrResult);
          });
        });
      };
      const txQueryRows = async (sql: any, params = []) => {
        const result = await txQueryPr(sql, params);
        return result.map(toCamelCase);
      };
      await beginTx();
      try {
        await txnFunction({ query: txQueryPr, getRows: txQueryRows });
        await commitTx();
      } catch (err) {
        await rollbackTx();
        throw err;
      }
    } finally {
      myConn.release();
    }
  };

  const shutdown = async () => {
    await myPool.end();
  };

  function fixRows(rows: any, fields: any) {
    const modFields = fields.map((f: any) => ({
      modName: keyToCamelCase(f.name),
      ...f,
    }));
    return rows.map((row: any) => {
      const modRow: any = {};
      for (const f of modFields) {
        const val = row[f.name];
        modRow[f.modName] = f.type === 245 && val ? JSON.parse(val) : val;
      }
      return modRow;
    });
  }
  return {
    query,
    getRows,
    stream,
    shutdown,
    transaction,
  };
}
