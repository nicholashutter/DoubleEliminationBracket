
import mariadb from "mariadb";
import { User} from "./user";
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
    this.user = user;
    this.db = "use userdb";
    this.query =
      "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);";
    
    this.params = [
      this.user.getUserID() as number,
      this.user.getUserName() as string,
      this.user.getEmail() as string,
      this.user.getPassword_Hash() as string,
      this.user.getCreatedAt() as Date,
      this.user.getLastUpdate() as Date,
    ];

    await this.doQuery(this.query, this.params);
  }

  async readUser(user: User):Promise<User> {
    this.user = user;
    this.db = "use userdb";
    this.query =
      "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";
      // id falls out of this function somewhere need to correct that 
      this.params = [
        this.user.getUserID() as number, 
        this.user.getUserName() as string,
        this.user.getEmail() as string
      ]

      const res: User = await this.doQuery(this.query,this.params);
      return res; 
  }

  async updateUser(user: User) {
    this.user = user; 
    this.db = "use userdb";
    this.query =
      "UPDATE users SET username = ?, email = ?, updated_at = ?, WHERE id = ? OR username = ? OR email = ?;";

      this.params = [
        this.user.getUserName() as string,  
        this.user.getEmail() as string,  
        new Date() as Date, 
        this.user.getUserID() as number, 
        this.user.getUserName() as string, 
        this.user.getEmail() as string
      ]
  }

  async deleteUser(user: User) {
    this.user = user; 
    this.db = "use userdb";
    this.query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?";

    this.params = [
      this.user.getUserID() as number, 
      this.user.getUserName() as string, 
      this.user.getEmail() as string
    ]

    this.doQuery(this.query,this.params);
  }

  async doQuery(query: string, params: any[]){
    try {
      this.conn = await pool.getConnection();

      let res: any = this.conn.query(this.db);

      res = await this.conn.query(this.query, this.params);

      //console.log(res);

      return res[0]; 

    } finally {
      if (this.conn) this.conn.release();
    }
  }
}


