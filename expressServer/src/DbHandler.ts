import { create } from "domain";
import { read } from "fs";
import mariadb from "mariadb";
import { User, IUser } from "./user";
// this class is still under construction need to add function
// to connect to specific databases as there will be
// a fighters database and a usercreds database
const pool: mariadb.Pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  connectionLimit: 50,
});

export default class DbHandler {
  protected conn: any;
  protected db: string;
  protected query: string;
  protected params: any;
  protected user: User;
  constructor() {
    this.db = "";
    this.query = "";
    this.params = [];
    this.user = new User("", "", "");
  }

  async createUser(user: User) {
    this.db = "use userdb";
    this.query =
      "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);";
    this.user = user;
    this.params = [
      this.user.getUserID() as number,
      this.user.getUserName() as string,
      this.user.getEmail() as string,
      this.user.getPasswordHash() as string,
      this.user.getCreatedAt() as Date,
      this.user.getLastUpdate() as Date,
    ];

    await this.doQuery(this.query, this.params);
  }

  async readUser(user: User) {
    this.db = "use userdb";
    this.query =
      "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";

      this.params = [
        this.user.getUserID() as number, 
        this.user.getUserName() as string,
        this.user.getEmail() as string
      ]

      await this.doQuery(this.query,this.params);
  }

  async updateUser(user: User) {
    this.db = "use userdb";
    this.query =
      "UPDATE users SET username = ?, email = ?, updated_at = ?, WHERE id = ? OR username = ? OR email = ?;";

      this.params = [
        this.user.getUserName() as string, 
        this.user.getEmail() as string,  
        this.user.getLastUpdate() as Date,
        this.user.getUserID() as number, 
        this.user.getUserName() as string, 
        this.user.getEmail() as string
      ]
  }

  async deleteUser(user: User) {
    this.db = "use userdb";
    this.query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?";

    this.params[
      this.user.getUserID() as number, 
      this.user.getUserName() as string, 
      this.user.getEmail() as string
    ]

    this.doQuery(this.query,this.params);
  }


/*one of the rare cases in my code where I will leave the return type implied because we won't always be returning 
  the same type 
*/
  async doQuery(query: string, params: any[]) {
    try {
      this.conn = await pool.getConnection();

      let res: Promise<any> = this.conn.query(this.db);

      console.log(res);

      res = await this.conn.query(this.query, this.params);

      console.log(res);
      return res; 

    } finally {
      if (this.conn) this.conn.release();
    }
  }
}

//probably need to come back and add shorthand functions for common queries once you have the query working
// particularly for ifExists since we will be checking that a lot
