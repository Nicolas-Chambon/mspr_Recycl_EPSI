require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('express-jwt');
const app = express();
const PORT = 3000;
const hookRouter = require("./routes/hookAzureIOT");
const registerRouter = require("./routes/users");
const demandRouter = require("./routes/demande");
const utilisateursRouter = require("./routes/utilisateurs");
const typeDechetRouter = require("./routes/typeDechet");
const tourneeRouter = require("./routes/tournee");
const recordPoubelleRouter = require("./routes/poubelles");
const {unprotectedRoutes} = require("./routes/constant")

const checkUserDb = require ('./middleware/checkUserDB')

const authenticate = require ('./middleware/authentication')





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//jwt Middleware
app.use(jwt({ secret: process.env.JWT_KEY}).unless({path: unprotectedRoutes}));
//JWT Error middleware
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).redirect('https://recyclr.herokuapp.com');
  }
});


app.use(checkUserDb);
//
app.use(authenticate);



//Import routes
app.use("/", hookRouter);
app.use("/", registerRouter);
app.use("/", recordPoubelleRouter);
app.use("/", demandRouter);
app.use("/", utilisateursRouter);
app.use("/", typeDechetRouter);
app.use("/", tourneeRouter);



app.get("/", (req, res) => {
  res.json({ message: "Hello World !" });
  res.status(200).end();
});


const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = server;
