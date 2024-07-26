import mariadb from "mariadb";
// this class is still under construction need to add function
// to connect to specific databases as there will be 
// a fighters database and a usercreds database
const pool: mariadb.Pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  connectionLimit: 50,
});

export default class DbHandler {
  constructor(sqlQuery: string) {
   this.tourneyDbConnect(sqlQuery);
  }
// this is mostly converted to typescript but we have a few explicit any to get rid of 
  async tourneyDbConnect(sqlQuery: string) {
    let conn: any;

    try {
      conn = await pool.getConnection();

      let res:any = conn.query("use tourneydb");

      console.log(res); 

      res = await conn.query(sqlQuery);

      console.log(res);
    } finally {
      if (conn) conn.release();
    }
  }

//probably need to come back and add shorthand functions for common queries once you have the query working 
// particularly for ifExists since we will be checking that a lot
}
