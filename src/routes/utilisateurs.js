const express = require('express');
const router = express.Router();

const database = require('../database/database');

const {getAllUsers, getUsersById, getAllUsersBySite} = require('../database/utilisateurs')

const {checkToken} = require('../utilities/checkToken')
// Json Web Token
const jwt = require("jsonwebtoken");


router.get('/utilisateur/:id', function (req, res) {

            getUsersById(req.params.id)
                .then((data) => {
                    if (!data || data.length === 0) {
                        console.log("empty");
                        return;
                    }
                    res.json({data});
                })
                .catch(e => console.error(e));

})

router.get('/utilisateurBySite/:id', function (req, res) {

            getAllUsersBySite(req.params.id)
                .then((data) => {
                    if (!data || data.length === 0) {
                        console.log("empty");
                        res.sendStatus(404);
                        return;
                    }
                    res.json({data});
                })
                .catch(e => console.error(e));

})

router.get('/utilisateurs', function (req, res) {

            getAllUsers()
                .then((data) => {
                    if (!data || data.length === 0) {
                        console.log("empty");
                        return;
                    }
                    res.json(data);
                })
                .catch(e => console.error(e));
})



module.exports = router;