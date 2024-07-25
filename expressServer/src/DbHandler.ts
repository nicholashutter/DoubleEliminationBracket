import mariadb from "mariadb";
// this class is still under construction need to add function
// to connect to specific databases as there will be 
// a fighters database and a usercreds database
const pool: mariadb.Pool = mariadb.createPool({
  host: "localhost",
  user: "superuser",
  connectionLimit: 50,
});

export default class DbHandler {
  constructor(sqlQuery: string) {
   this.dbConnect(sqlQuery);
  }
// this is mostly converted to typescript but we have a few explicit any to get rid of 
  async dbConnect(sqlQuery: string) {
    let conn: any;

    try {
      conn = await pool.getConnection();

      const res: any = await conn.query(sqlQuery);

      console.log(res);
    } finally {
      if (conn) conn.release();
    }
  }


}
