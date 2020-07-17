

const unprotectedRoutes = [
    /^\/reset_password\/.*/, //Expression regulière car n'accepte pas les routes avec parametres /reset_password/:token
    "/login",
    "/resetSession",
    "/",
    "/register",
    /^\/verify\/.*/,
    "/resend_email",
    "/forgot",
    "/iot/hook",
    "/iot/hook/recordpoubelle"
]

module.exports = {
    unprotectedRoutes
};
