import { IDbUtils } from "../config/mysql";

export class Users {
  constructor(private dbConn: IDbUtils) {}
  async getAll() {
    const sql = `
        SELECT * FROM users
        `;
    const rows = await this.dbConn.getRows(sql, []);
    return rows.length ? rows : null;
  }

  async getUser(id: string) {
    const sql = `
    SELECT * FROM users
    WHERE id = ?`;
    const rows = await this.dbConn.getRows(sql, [id]);
    return rows && rows.length > 0 ? rows : null;
  }

  async insertUser(user: {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
  }) {
    const { id, username, age, hobbies } = user;
    let row;
    await this.dbConn.transaction(async (txconn: any) => {
      const result = await txconn.query(
        `INSERT INTO users (id, username, age, hobbies)
        VALUES(?,?,?,?)`,
        [id, username, age, JSON.stringify(hobbies)]
      );
      if (result) {
        row = await txconn.getRows("SELECT * FROM users WHERE id = ?;", [id]);
      }
    });
    return row;
  }

  async updateUser(user: {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
  }) {
    const { id, username, age, hobbies } = user;
    let row;
    await this.dbConn.transaction(async (txconn: any) => {
      const result = await txconn.query(
        `UPDATE users
         SET username = ?, age = ?, hobbies = ?
         WHERE id = ?;`,
        [username, age, JSON.stringify(hobbies), id]
      );
      if (result) {
        row = await txconn.getRows("SELECT * FROM users WHERE id = ?;", [id]);
      }
    });
    return row;
  }

  async deleteUser(id: string) {
    const sql = `
    DELETE FROM users WHERE id = ?`;
    const { affectedRows } = await this.dbConn.query(sql, [id]);
    return affectedRows;
  }
}
