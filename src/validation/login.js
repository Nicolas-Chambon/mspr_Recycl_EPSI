const Validator = require("validator");
const ifEmpty = require("./checkForEmpty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    // data.email = !ifEmpty(data.login) ? data.email : "";
    data.login = !ifEmpty(data.login) ? data.login : "";
    data.password = !ifEmpty(data.password) ? data.password : "";

    // if (!Validator.isEmail(data.login)) {
    //     errors.login = "Invalid login";
    // }

    if (Validator.isEmpty(data.login)) {
        errors.login = "login is required";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }

    return {
        errors,
        isValid: ifEmpty(errors)
    };
};