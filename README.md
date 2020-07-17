MSPR : mspr-connected-objects-recycle
=====================================

# Pre-requires
For making it easier, install a node version manager [nvm](https://github.com/nvm-sh/nvm)
Install InstantClient and follow instructions [OracleDb](https://www.oracle.com/database/technologies/instant-client.html) etc. 
Add this file [tnsnames.ora](/utils/tnsnames.ora) in your `Oracle_instant_Cli_directory/network/admin`
Set your environment variables (mind your versions), such as : 
```
export ORACLE_HOME=/Users/Dee/Sites/tools_and_servers/instantclient_19_3
export PATH=$ORACLE_HOME:$PATH
export TNS_ADMIN=$ORACLE_HOME/network/admin:$PATH
export LD_LIBRARY_PATH=/Users/Dee/Sites/tools_and_servers/instantclient_19_3:$LD_LIBRARY_PATH
```

Test your cli to connect with the db :
`sqlplus rlille/rlille@109.190.202.251:1521/XEPDB1` or
`sqlplus rparis/rparis@109.190.202.251:1521/XEPDB1`

# Project installation
`npm install`
if you have issues, try : 
`npm install oracledb --save`

Don't forget .env files, ask to admin

Try to run the connection with the select in the project : 
Create a file or use src/database.js.
Needed lines are : 
```
const database = require('knex')({
  client: 'oracledb',
  connection: {
    host: '109.190.202.251:1521',
    user: 'rlille',
    password: 'rlille',
    database: 'XEPDB1'
  },
  debug: true
});

database.select().from('EMPLOYE')
  .then(data => {
    console.log(data);
    database.destroy();
  })
  .catch(err => console.log(err))
``` 
Run it `node src/database/database.js`




