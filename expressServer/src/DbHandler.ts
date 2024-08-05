import mariadb from "mariadb";
import { IUser, User } from "./user";

/*Access mariadb connector library create pool method and creating pool with specified values*/
const pool: mariadb.Pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  connectionLimit: 50,
});

/*
Class Dbhandler handles all operations to and from database 
*/
export default class DbHandler {
  protected conn: any;
  protected db: string;
  protected user: User;
/*
Set initial state of class members for later access
*/
  constructor() {
    this.db = "";
    this.user = new User("", "", "");
  }
/*
Function DbHandler.createUser() creates User record in database
*/
  async createUser(user: User) {
    this.user = user;
    this.db = "use userdb";
    const query =
      "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);";

    const params = [
      this.user.getUserID() as number,
      this.user.getUserName() as string,
      this.user.getEmail() as string,
      this.user.getPassword_Hash() as string,
      this.user.getCreatedAt() as Date,
      this.user.getLastUpdate() as Date,
    ];

    await this.doQuery(query, params);
  }
/*
Function DbHandler.readUser() reads the database and either returns it or returns an empty user object with an id of -1 which denotes not found
*/
  async readUser(user: User): Promise<User> {
    this.user = user;
    this.db = "use userdb";
    const query =
      "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";

    const params = [
      this.user.getUserID() as number,
      this.user.getUserName() as string,
      this.user.getEmail() as string,
    ];
    const userObject = await this.doQuery(query, params);

    let returnUser: User = new User("", "", "", -1);
    if (userObject !== undefined) {
      returnUser = new User(
        userObject.username,
        userObject.password_hash,
        userObject.email,
        userObject.id
      );
    }

    return returnUser;
  }
/*
Function DbHandler.deleteUser() deletes the selected user from the database 

Known Bug this function always returns success even if the object selected does not exist
*/
  async deleteUser(user: User) {
    this.user = user;
    this.db = "use userdb";
    const query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?";

    const params = [
      this.user.getUserID() as number,
      this.user.getUserName() as string,
      this.user.getEmail() as string,
    ];

    this.doQuery(query, params);
  }
/*
Function DbHandler.doQuery() performs the text query against the database using the parameters entered in the params array 

*/
  async doQuery(query: string, params: any[]) {
    try {
      this.conn = await pool.getConnection();

      let res: any = this.conn.query(this.db);

      res = await this.conn.query(query, params);

      if (res.length > 0) {
        return res[0];
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (this.conn) this.conn.release();
    }
  }
}
