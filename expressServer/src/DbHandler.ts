
import mariadb from "mariadb";
import { IUser, User} from "./user";
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
  protected user: User;
  constructor() {
    this.db = "";
    this.user = new User("", "", "");
  }

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

  async readUser(user: User):Promise<User> {
    this.user = user;
    this.db = "use userdb";
    const query =
      "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";
      
      const params = [
        this.user.getUserID() as number, 
        this.user.getUserName() as string,
        this.user.getEmail() as string
      ]
      const userObject = await this.doQuery(query,params);

      let returnUser: User = new User("","","",-1); 
      if (userObject !== undefined)
        {
          returnUser = new User(userObject.username, userObject.password_hash, userObject.email, userObject.id);
        }
      
      return returnUser;   
  }

  async deleteUser(user: User) {
    this.user = user; 
    this.db = "use userdb";
    const query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?";

    const params = [
      this.user.getUserID() as number, 
      this.user.getUserName() as string, 
      this.user.getEmail() as string
    ]

    this.doQuery(query,params);
  }


  async doQuery(query: string, params: any[]){
    try {
      this.conn = await pool.getConnection();

      let res: any = this.conn.query(this.db);

      res = await this.conn.query(query, params);

      if (res.length > 0) {return res[0];}


    } catch(e)
    {
      console.log(e);
    }
    finally {
      if (this.conn) this.conn.release();
    }
  }
}


