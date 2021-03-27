const {Router} = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") // модуль для работы с токеном
const config = require("config");
const {check, validationResult} = require("express-validator");
const User = require("../models/User");
const router = Router();

router.post(
    "/register",
    [
        check("email", "Incorrect email!").isEmail(), //проверка поля email
        check("password", "Min pass length - 6 chars").isLength({min: 6}), // проверка пароля на мин кол-во символов
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect registration data!",
                });
            }

            const {email, password, firstName, lastName, username} = req.body;

            const candidate = await User.findOne({email});
            const nick = await User.findOne({username});
            if (candidate) {
                return res.status(400).json({message: "User already exist!"});
            }
            if (nick) {
                return res.status(400).json({message: "Username is busy."});
            }

            const hashedPassword = await bcrypt.hash(password, 13);
            const user = new User({email, password: hashedPassword, firstName, lastName, username});

            await user.save();
            res.status(201).json({message: "New user created!"});
        } catch (e) {
            res.status(500).json({message: "Something went wrong!"});
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Incorrect email!").normalizeEmail().isEmail(), //проверка поля email
        check("password", "Enter password!").exists(), // проверка пароля на наличие символов
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect login data!",
                });
            }

            const {email, password} = req.body;

            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({message: "No such user."});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({message: "Wrong password!"});
            }

            const token = jwt.sign(
                {userId: user.id}, // Первым параметром указываем параметры, которые будут зашифровны в данном токене
                config.get("jwtSecret"), // Вторым параметром передается секретный ключ, который берез из Конфига
                {expiresIn: "12h"} // Третьим параметром идет объект, в котором указывается срок жизни токена
            );
            res.json({
                token,
                userId: user.id,
                userInfo: {
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            });
        } catch (e) {
            res.status(500).json({message: "Something went wrong!"});
        }
    }
);

module.exports = router;