import mariadb from "mariadb";
import { IUser, User } from "./user";

/*Access mariadb connector library create pool method and creating pool with specified values*/
const pool: mariadb.Pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  connectionLimit: 50,
});

/*
Class DbHandler

Purpose: 

Class to handle operations between back end logic and database
All functions contain SQL that defines handling CRUD operations from application
Except doQuery which all other functions use to actually grab a connection 
from the database pool and execute
*/
export default class DbHandler {
  protected conn: any;
  protected db: string;
  protected user: User;
/*
Function DbHandler.Constructor()

Purpose: 

Set initial state of class members for later access
*/
  constructor() {
    this.db = "";
    this.user = new User("", "", "");
  }
/*
Function DbHandler.createUser()

Purpose: 

Assign class member user to local user parameter
Select which database to use
SQL query that creates database record that mirrors our object
and sends values to be entered by mariadb at runtime as params
Call doQuery and wait for a value to be returned 
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
Function DbHandler.readUser()

Purpose: 

Assign class member user to local user parameter
Select which database to use
SQL query that selects database records based on values retrieved from user parameter
Call doQuery and wait for a value to be returned 
If database finds matching record, return that record as a user object
Else return an empty user object with id -1 indicating no user found
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
Function DbHandler.deleteUser()

Purpose: 

Assign class member user to local user parameter
Select which database to use
SQL query that deletes database record based on values retrieved from user parameter 
Call doQuery and wait for a value to be returned 
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
Function DbHandler.doQuery()

Purpose: 

conn class member set to represent database connection
res set to result of choosing which database to use
res set to result of executing query against the database 
res becomes an array if database returns a response
return the first value in the array if length greater than 0
if database returns an object it will be the first value of the array
wrap all logic in try catch finally 
print error to console if caught
Always end by releasing database connection

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
