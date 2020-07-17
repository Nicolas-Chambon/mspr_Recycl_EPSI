const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const database = require("../database/database");
// Json Web Token
const jwt = require("jsonwebtoken");
// Send email utility
const sendEmail = require("../utilities/sendEmail");
// Validation
const checkRegistrationFields = require("../validation/register");
// Resend email validaiton
const checkResendField = require("../validation/resend");
// Secret key
const key = require("../utilities/keys")
// Login validation
const validateLoginInput = require("../validation/login");
// Forgot password validation
const validateResetInput = require("../validation/checkEmail");
// Validate new passwords
const validatePasswordChange = require("../validation/newPassword");
// monthDiff
const {monthDiff} = require("../utilities/monthDiff")


// Register route
router.post("/register", (req, res) => {

    // Ensures that all entries by the user are valid
    const { errors, isValid } = checkRegistrationFields(req.body);

    // If any of the entries made by the user are invalid, a status 400 is returned with the error
    if (!isValid) {
        return res.status(400).json(errors);
    }


    //Creation token
    let token;
    crypto.randomBytes(48, (err, buf) => {
        if (err) throw err;
        token = buf
            .toString("base64")
            .replace(/\//g, "") // Because '/' and '+' aren't valid in URLs
            .replace(/\+/g, "-");
        return token;
    });


    //Action on DB

    
    bcrypt.genSalt(12, (err, salt) => {
      if (err) throw err;
      bcrypt.hash("123456789", salt, (err, hash) => {
        if (err) throw err;
    
    database("UTILISATEUR")
        .returning(["NOEMPLOYE", "EMAIL", "REGISTRED", "TOKEN", "LOGIN"])
        .insert({
            // NOEMPLOYE:1200,
            NOM:req.body.nom,
            PRENOM:req.body.prenom,
            NOFONCTION:req.body.nofonction,
            NOSITE:req.body.nosite,
            EMAIL: req.body.email,
            TOKEN: token,
            CREATETIME: Date.now(),
            EMAILVERIFIED: 0,
            TOKENUSEDBEFORE: 0
        })
        .then(user => {
            let to = [user[0].email]; // Email address must be an array

            // When you set up your front-end you can create a working verification link here
            let link = "https://yourWebsite/v1/users/verify/" + user[0].token;

            // Subject of your email
            let sub = "Confirm Registration";

            // In this email we are sending HTML
            let content =
                "<body><p>Please verify your email.</p> <a href=" +
                link +
                ">Verify email</a></body>";
            // Use the Email function of our send email utility
            sendEmail(to, sub, content);

            res.json(user[0]);
        })
        .catch(err => {
            console.log(err);
            errors.account = "Email already registered";
            res.status(400).json(errors);
        });
      });
      });
});



router.post("/verify/:token", (req, res) => {
    const { token } = req.params;
    const errors = {};

    database
    .returning(["EMAIL", "EMAILVERIFIED", "TOKENUSEDBEFORE"])
    .from("UTILISATEUR")
    .where({ TOKEN: token, TOKENUSEDBEFORE: "0" })
    .update({ EMAILVERIFIED: "1", TOKENUSEDBEFORE: "1" })
    .then(data => {
      if (data.length > 0) {
        res.json(
          "Email verified! Please login to access your account"
        );
      }
      else {
        database
          .select("EMAIL", "EMAILVERIFIED", "TOKENUSEDBEFORE")
          .from("UTILISATEUR")
          .where("TOKEN", token)
          .then(check => {
            if (check.length > 0) {
              if (check[0].emailverified === 1) {
                errors.alreadyVerified =
                  "Email already verified. Please login to your account.";
                res.status(400).json(errors);
              }  } else { 
                errors.email_invalid =
                  "Email invalid. Please check if you have registered with the correct email address or re-send the verification link to your email.";
                res.status(400).json(errors);
              }
            })
            .catch(err => {
              errors.db = "Bad request";
              res.status(400).json(errors);
            });
        }
      })
      .catch(err => {
        errors.db = "Bad request";
        res.status(400).json(errors);
      });
  });

router.post("/resend_email", (req, res) => {
    //Require : email

    console.log(req.body.email)
    const { errors, isValid } = checkResendField(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    let resendToken;
    crypto.randomBytes(48, (err, buf) => {
        if (err) throw err;
        resendToken = buf
            .toString("base64")
            .replace(/\//g, "")
            .replace(/\+/g, "-");
        return resendToken;
    });
    database
        .table("UTILISATEUR")
        .select("*")
        .where( "EMAIL", "=", req.body.email )
        .then(data => {
            console.log(data)
            if (data.length === 0) {
                errors.invalid = "Invalid email address. Please register again!";
                res.status(400).json(errors);
            } else {
                database
                    .table("UTILISATEUR")
                    .returning(["EMAIL", "TOKEN"])
                    .where({ EMAIL: data[0].EMAIL, EMAILVERIFIED: 0 })
                    .update({ TOKEN: resendToken, CREATETIME: Date.now() })
                    .then(result => {
                        if (result.length) {
                            let to = [result[0].EMAIL];

                            let link =
                                "https://NotreServeur/verify/" + result[0].TOKEN;

                            let sub = "Confirm Registration";

                            let content =
                                "<body><p>Please verify your email.</p> <a href=" +
                                link +
                                ">Verify email</a></body>";
                            sendEmail(to, sub, content);

                            res.json("Email re-sent!");
                        } else {
                            errors.alreadyVerified =
                                "Email address has already been verified, please login.";
                            res.status(400).json(errors);
                        }
                    })
                    .catch(err => {
                        errors.db = "Bad request icici";
                        res.status(400).json(err);
                    });
            }
        })
        .catch(err => {
            errors.db = "Bad request";
            res.status(400).json(errors);
        });
});

// Login route
router.post("/login", (req, res) => {
// Ensures that all entries by the user are valid
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(200).json(errors);
    } else {
        database("UTILISATEUR")
            .select('*')
            .where("LOGIN", "=", req.body.login)
            .leftJoin("FONCTION", "UTILISATEUR.NOFONCTION", "FONCTION.NOFONCTION")
            .leftJoin("SITES", "UTILISATEUR.NOSITE", "SITES.NOSITE")

            .then(data => {
                let currentDate = Date.now();
                currentDate = new Date(currentDate);
                let lastPassChange = new Date(data[0].REGISTRED)
                if (monthDiff(lastPassChange, currentDate) > 2){
                    res.status(203).json({error : "2Vous devez changer votre mot de passe"})
                }
                else if (data[0].NOMBREAPPSCONNECTES >=2){
                    res.status(203).json({error : "3Trop d'appareils sont connectés en même temps, veuillez vous déconnectez"})
                }
                else if (data[0].EMAILVERIFIED === 0) {
                    res.status(203).json({error : "4Votre email n'est pas encore vérifié"})
                }
                else if (data[0].NOMBRETENTATIVESPASS >2){
                    res.status(203).json({error :"5Tentative de connexions autorisées dépassé, veuillez contacter un administrateur"})
                }
                    else {
                        bcrypt.compare(req.body.password, data[0].PASS)
                        .then(isMatch => {
                            if (isMatch) {
                                const payload = { id: data[0].NOEMPLOYE, email: data[0].EMAIL };
                                jwt.sign(
                                    payload,
                                    process.env.JWT_KEY,
                                    { expiresIn: 3600 },
                                    (err, token) => {
                                            database
                                                .table("UTILISATEUR")
                                                .where({ NOEMPLOYE: data[0].NOEMPLOYE})
                                                .update({NOMBREAPPSCONNECTES: data[0].NOMBREAPPSCONNECTES, NOMBRETENTATIVESPASS:0})// pour Devops (j'ai enlever le +1 a nbappconnecte)
                                                .then(() =>{
                                                    res.status(200).json({bearer :"Bearer " + token, data : data[0]})
                                                })
                                                .catch(err => {
                                                    console.error(err)
                                                    res.status(400).json({error : err})
                                                })
                                    })
                            } else {

                                database
                                    .table("UTILISATEUR")
                                    .where({ NOEMPLOYE: data[0].NOEMPLOYE})
                                    .update({NOMBRETENTATIVESPASS:data[0].NOMBRETENTATIVESPASS +1})
                                    .then(() =>{
                                        res.status(203).json({error :"1Email ou mot de passe incorrect"})
                                    })
                                    .catch(err => {
                                        console.error(err)
                                        res.status(400).json({error : err})
                                    })


                            }
                        })
                        .catch((e) => {
                            res.status(400).json({error :"1Email ou mot de passe incorrect"})
                        })
                    }
            })
            .catch(err => {
                res.status(203).json({error :"1Email ou mot de passe incorrect"})
            })
    }
});

router.post("/logout", function(req, res) {
    const token = req.headers['usertoken'];
    if (!token) {
        res.status(203).json('Aucun JWT')
    }
    else{
        database
        .table("UTILISATEUR")
        .where({ TOKEN: token})
        .then((data) => {
            if (data.length === 0){
                res.status(403).json('Impossible')
            }
            else {
                database
                    .table("UTILISATEUR")
                    .where({ TOKEN: token})
                    .update({ NOMBREAPPSCONNECTES: data[0].NOMBREAPPSCONNECTES - 1  })
                    .then((data) => {
                        res.status(200).json('Logout Success !')
                    })
                    .catch(err => {
                        console.error(err)
                        res.status(400).json('Logout Failed !')
                    })
            }

        })
        .catch((e) => {
            console.error(e)
            res.status(400).json('Logout Failed !')
        })
    }
})

router.post("/resetSession", (req, res) => {
// Ensures that all entries by the user are valid
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(200).json(errors);
    } else {
        database("UTILISATEUR")
            .select('*')
            .where("LOGIN", "=", req.body.login)
            .leftJoin("FONCTION", "UTILISATEUR.NOFONCTION", "FONCTION.NOFONCTION")
            .leftJoin("SITES", "UTILISATEUR.NOSITE", "SITES.NOSITE")
            .then(data => {
                bcrypt.compare(req.body.password, data[0].PASS)
                .then(isMatch => {
                    if (isMatch) {
                        database
                            .table("UTILISATEUR")
                            .where({ NOEMPLOYE: data[0].NOEMPLOYE})
                            .update({ JWT_TOKEN: "", NOMBREAPPSCONNECTES: 0  })
                            .then(() => {
                                res.status(200).json({success:'Reset Success !'})
                            })
                            .catch(err => {
                                console.error(err)
                                res.status(400).json({error : err})
                            })
                    } else {
                        res.status(203).json({error:"Email ou mot de passe incorrect"})
                    }
                })
                .catch((e) => {
                    res.status(400).json(e)
                })
            })
            .catch(err => {
                res.status(203).json(err)
            })
    }
});




router.post("/forgot", function(req, res) {
    //Require : email

    const {errors, isValid } = validateResetInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    let resetToken;
    crypto.randomBytes(48, (err, buf) => {
        if (err) throw err;
        resetToken = buf.toString("hex");
        return resetToken;
    });
    database
        .table("UTILISATEUR")
        .select("*")
        .where("EMAIL", req.body.email)
        .then(emailData => {
            console.log(req.body.email)
            if (emailData.length === 0) {
                res.status(201).json({error : "2Invalid email address"});
            }
            else {
                database
                    .table("UTILISATEUR")
                    .where("EMAIL", emailData[0].EMAIL)
                    .update({
                        RESET_PASSWORD_TOKEN: resetToken,
                        RESET_PASSWORD_EXPIRES: Date.now(),
                        RESET_PASSWORD_TOKEN_USED: 0
                    }).then(done => {
                    console.log(resetToken)
                    let to = [req.body.email];

                    let link = "https://recyclr.herokuapp.com/reset_password?resettoken=" + resetToken;

                    let sub = "Reset Password";

                    let content =
                        "<body><p>Please reset your password.</p> <a href=" +
                        link +
                        ">Reset Password</a></body>";
                    //Passing the details of the email to a function allows us to generalize the email sending function
                    sendEmail(to, sub, content);

                    res.status(200).json({success : "1Vous avez reçu un lien par email afin de réinitialiser votre mot de passe"});
                })
                    .catch(err => {
                        console.log(err)

                        res.status(400).json("Bad Request");
                    });
            }
        })
        .catch(err => {
            res.status(400).json("Bad Request");
        });
});

router.post("/reset_password/:token", function(req, res) {
    //Rquire
    //    password1
    //    password2

    const { token } = req.params;
    database
        .select(["NOEMPLOYE", "EMAIL", "TOKEN"])
        .from("UTILISATEUR")
        .where({ RESET_PASSWORD_TOKEN: token, RESET_PASSWORD_TOKEN_USED: 0 })
        .then(data => {
            if (data.length > 0) {
                const { errors, isValid } = validatePasswordChange(req.body);

                if (!isValid) {
                    return res.status(400).json(errors);
                }

                bcrypt.genSalt(12, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(req.body.password1, salt, (err, hash) => {
                        if (err){
                            console.log('here')
                            throw err
                        }
                        if (!data[0].TOKEN){
                            database("UTILISATEUR")
                                .returning("EMAIL")
                                .where({ NOEMPLOYE: data[0].NOEMPLOYE, EMAIL: data[0].EMAIL })
                                .update({ PASS: hash, RESET_PASSWORD_TOKEN_USED: 1 , REGISTRED : Date.now(), TOKEN: token})
                                .then(user => {
                                    const subject = "Password change for your account.";
                                    const txt = `The password for your account registered under ${
                                        user[0]
                                    } has been successfully changed.`;

                                    sendEmail([user[0]], subject, txt);
                                    res.status(200).json("Password successfully changed for " + user[0] + "!");
                                })
                                .catch(err => {
                                    res.status(400).json(errors);
                                });
                        }
                        else{
                            database("UTILISATEUR")
                                .returning("EMAIL")
                                .where({ NOEMPLOYE: data[0].NOEMPLOYE, EMAIL: data[0].EMAIL })
                                .update({ PASS: hash, RESET_PASSWORD_TOKEN_USED: 1 , REGISTRED : Date.now()})
                                .then(user => {
                                    const subject = "Password change for your account.";
                                    const txt = `The password for your account registered under ${
                                        user[0]
                                    } has been successfully changed.`;

                                    sendEmail([user[0]], subject, txt);
                                    res.status(200).json("Password successfully changed for " + user[0] + "!");
                                })
                                .catch(err => {
                                    res.status(400).json(errors);
                                });
                        }

                    });
                });
            } else {
                res.status(203).json("Password reset error!");
            }
        })
        .catch(err => res.status(400).json("Bad request"));
});


module.exports = router;