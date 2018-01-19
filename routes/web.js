const express = require("express");
const authMiddleware = require("connect-ensure-login");
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
const Message = require("../models/message");
const User = require("../models/user");

const router = express.Router();
const loginController = require("../controllers/login-controller");

router.get("/", authMiddleware.ensureLoggedIn(), (req, res) => {
    console.log("User:", req.user);
    Message.find({})
        .populate("author")
        .exec((err, messages) => {
            if (err) {
                console.log(err);
            }
            res.render("chat/home", {
                messages
            });
        });
});

router.post("/", authMiddleware.ensureLoggedIn(), (req, res) => {
    const message = new Message({
        author: req.user[0]._id,
        body: req.body.message,
        createdAt: Date.now()
    });
    message.save((err, res) => {
        console.log(err);
        console.log(res);
    });
    res.redirect("/");
});

router.get("/login", authMiddleware.ensureLoggedOut(), loginController.index);
router.post(
    "/login",
    [
        check("username")
            .isEmail()
            .withMessage("Must be an email")
            .trim()
            .normalizeEmail(),
        check(
            "password",
            "Passwords must be at least 5 chars long and contain one number"
        )
            .isLength({ min: 5 })
            .matches(/\d/)
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped());
            return res.render("auth/login", {
                errors: errors.mapped()
            });
        }
        next();
    },
    authMiddleware.ensureLoggedOut(),
    loginController.login
);
router.get(
    "/register",
    authMiddleware.ensureLoggedOut(),
    loginController.registerIndex
);
router.post(
    "/register",
    (req, res, next) => {
        console.log(req.body);
        next();
    },
    [
        check("email", "Must be an email")
            .isEmail()
            .trim()
            .normalizeEmail(),
        check(
            "password",
            "Passwords must be at least 5 chars long and contain one number"
        )
            .isLength({ min: 5 })
            .matches(/\d/),
        check("image", "You must choose image!").exists()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors.mapped());
        if (!errors.isEmpty()) {
            return res.render("auth/registration", {
                errors: errors.mapped()
            });
        }
        next();
    },
    authMiddleware.ensureLoggedOut(),
    loginController.register
);
router.post("/logout", authMiddleware.ensureLoggedIn(), loginController.logOut);

module.exports = router;
