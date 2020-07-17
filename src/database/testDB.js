// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = 'rRecycle';  // set mypw to the hr schema password

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(  {
      user          : "rrecycle",
      password      : mypw,
      connectString : "109.190.202.251:1521/XEPDB1"
    });

    const result = await connection.execute(
      `SELECT NOEMPLOYE FROM UTILISATEUR WHERE NOEMPLOYE = 1`
    );
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();