const database = require('knex')({
  client: 'oracledb',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE
  },
  debug: true
});
// database("UTILISATEUR").then((data) => {
//   console.log(data)
// }).catch((e) => {
//   console.log(e)
// });
// const device_id = 'xwwzvcgsb4'
// const weightValue = 49.63603564545636
// database
//     .from("POUBELLES")
//     .leftJoin('ENTREPRISE', 'POUBELLES.SIRET','ENTREPRISE.SIRET')
//     .select("*")
//     .where({ DEVICE_ID : device_id })
//     .then(poubelle => {
//       // console.log(req.body.device.id)
//       console.log(poubelle[0])
//         let date = new Date(); //by default now
//         let today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
//          const typeDechet = poubelle[0].NOTYPEDECHET
//         console.log(today)
//         console.log(poubelle[0].SIRET)
//         console.log(poubelle[0].NOSITE)
//         console.log(poubelle[0].DEVICE_ID)
//
//
//
//       database("DEMANDE")
//           .returning(["DATEDEMANDE", "SIRET", "NOSITE", "NOPOUBELLE"])
//           .insert({
//               DATEDEMANDE:today,
//               SIRET: poubelle[0].SIRET,
//               NOSITE:poubelle[0].NOSITE,
//               NOPOUBELLE: poubelle[0].DEVICE_ID
//
//
//           })
//           .then(demande => {
//
//               console.log(demande[0])
//
//           })
//           .catch(err => {
//               console.log(err);
//               // res.status(400).json(err);
//           });
//
//     })
//     .catch(err => {
//       console.log(err);
//       // res.status(400).json(err);
//     });




module.exports = database;