import { create } from "domain";
import { read } from "fs";
import mariadb from "mariadb";
import {User, IUser} from './user';
// this class is still under construction need to add function
// to connect to specific databases as there will be
// a fighters database and a usercreds database
const pool: mariadb.Pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  connectionLimit: 50,
});

export default class DbHandler {
  protected conn: any
  protected db: string;
  protected query: string; 
  protected params: any;
  protected user: User;
  constructor(sqlQuery: string) {
    this.db = "";
    this.query = ""; 
    this.params = [];
    this.user = new User("", 0, "");
    
  }
  // this function will handle most database actions and is being written in a somewhat cumbersome way to avoid issues 
  // with overloading the call stack in nodejs 
  // use the optional boolean flags to select from common requests 
  async userDbCRUD(user:User,createUser?:boolean,
     readUser?:boolean, updateUser?:boolean, deleteUser?:boolean) {
      try {
            if (createUser){

              //need to finish this out with parameterized sql values to avoid sql vulnerabilities 
              this.db = "use userdb";
              this.query = "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);"
              this.user = user; 
              this.params = [
                this.user.getUserID() as number, 
                this.user.getEmail() as string, 
                this.user.getPasswordHash() as number, 
                this.user.getCreatedAt() as Date, 
                
              ]
              
            }
            else if (readUser){
              this.db = "use userdb";
              this.query = "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";

              if (params.length != 2){
                throw new Error("DbHandler.userDbCRUD.readUser called with incorrect parameter length");
              }
              else{
                this.params = params;
              }
               
            }
            else if(updateUser){
              this.db = "use userdb";
              this.query = "UPDATE users SET username = ?, email = ?, updated_at = ?, WHERE id = ? OR username = ? OR email = ?;";
              if (params.length != 4){
                throw new Error("DbHandler.userDbCRUD.updateUser called with incorrect parameter length");
              }
              else{
                this.params = params;
              }
            }
            else if (deleteUser){
              this.db = "use userdb";
              this.query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?"
              if (params.length != 1){
                throw new Error("DbHandler.userDbCRUD.deleteUser called with incorrect parameter length");
              }
              else{
                this.params = params;
              }
            }
      }
      catch (e)
      {
        throw new Error("DbHandler.userDbCRUD called with no arguments or invalid arguments");
      }

    try {
      this.conn = await pool.getConnection();

      let res: any = this.conn.query(this.db);

      console.log(res);

      res = await this.conn.query(this.query, this.params);

      console.log(res);
    } finally {
      if (this.conn) this.conn.release();
    }

  
  }

  //probably need to come back and add shorthand functions for common queries once you have the query working
  // particularly for ifExists since we will be checking that a lot
}
