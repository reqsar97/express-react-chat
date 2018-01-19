const passport = require("passport");
const User = require("../models/user");

function showLoginView(req, res) {
    res.render("auth/login");
}

function showRegisterView(req, res) {
    res.render("auth/registration");
}

function register(req, res) {
    console.log(req.body);
    const user = new User({
        username: req.body.email,
        password: req.body.password,
        imgUrl: req.file.filename
    });
    user.save((err, user) => {
        if (err) {
            console.log(err);
        }
        console.log(user);
    });
    res.redirect(303, "/login");
}

function login(req, res, next) {
    console.log(req.body);
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(user);
            console.log(info);
            console.log(12345);
            return res.redirect("/login");
        }
        req.logIn(user, err => {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
}

function logOut(req, res) {
    req.logOut();
    res.redirect("/login");
}

module.exports = {
    index: showLoginView,
    login,
    registerIndex: showRegisterView,
    register,
    logOut
};
