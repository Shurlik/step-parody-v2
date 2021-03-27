const {Router} = require("express");
const jwt = require("jsonwebtoken") // модуль для работы с токеном
const config = require("config");
const User = require("../models/User");
const router = Router();

router.get(
    '/',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.json(null)
            }
            const token = req.headers.authorization.split(" ")[1]
            if (!token) {
                return res.json(null)
            }
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            const userId = decoded.userId
            const user = await User.findById(userId)
            res.json({
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            })
        } catch (e) {
            res.status(500).json({message: "Something went wrong!"});
        }
    }
)

module.exports = router;