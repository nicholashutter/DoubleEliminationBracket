import mariadb from "mariadb";
import UserManager from "./user";

//TODO fix this 
   async function updateUser(userID: number)
  {

    const userManager = UserManager.getInstance;
    const foundUser = userManager.getUser(userID);

    const selectDb = "use userdb";
    const query =
      `INSERT INTO users (id, username, email, passwordHash, created, lastUpdate, inGame, 
      currentRank, allTimeWins, allTimeLosses, totalGamesPlayed) 
      VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?);`;

    let foundInGame: number|boolean = foundUser.getInGame;

    if (foundInGame) 
    {
      foundInGame = 1; 
    }
    else 
    {
      foundInGame = 0;
    }

    const params = [
      foundUser.getUserID as number,
      foundUser.getUserName as string,
      foundUser.getEmail as string,
      foundUser.getPasswordHash as string,
      foundUser.getCreated as Date,
      foundUser.getLastUpdate as Date,
      foundInGame as number,
      foundUser.getCurrentRank as number,
      foundUser.getAllTimeWins as number,
      foundUser.getAllTimeLosses as number,
      foundUser.getGamesPlayed as number
     // TODO some way to store all dates the user has played over time 
     // will probably have to create and load from another database table 
    ];


    await doQuery(selectDb, query, params);

  }

  async function readUser(userID: number)
  {

    const userManager = UserManager.getInstance;
    const foundUser = userManager.getUser(userID);

    const selectDb = "use userdb";
    const query =
      "SELECT FROM users WHERE user_id = ?";


    const params =
      [
        foundUser.getUserID as number
      ];

    return await doQuery(selectDb, query, params);
  }


  async function deleteUser(userID: number)
  {
    const userManager = UserManager.getInstance;
    const foundUser = userManager.getUser(userID);

    const selectDb = "use userdb";
    const query =
      "SELECT FROM users WHERE user_id = ?";


    const params =
      [
        foundUser.getUserID as number
      ];
      
    return await doQuery(selectDb, query, params);
  }


  const pool: mariadb.Pool =
    mariadb.createPool({
      host: "localhost",
      user: "root",
      connectionLimit: 50,
    });

  async function doQuery(selectDb: string, query: string, params: any[])
  {
    let conn: any = null;
    try
    {
      conn = await pool.getConnection();

      let res: any = conn.query(selectDb);

      res = await conn.query(query, params);

      if (res.length > 0)
      {
        return res[0];
      }
    } catch (e)
    {
      console.log(e);
    } finally
    {
      if (conn) conn.release();
    }
  }

export {updateUser, readUser, deleteUser}

