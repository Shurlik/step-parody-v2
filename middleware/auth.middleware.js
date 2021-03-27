const jwt = require("jsonwebtoken")
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') { // специальный метод, который присутствует в Rest API и проверяет доступность сервера
        return next()
    }
    try {
        const token = req.headers.authorization.split(" ")[1]  // получаем токен, он передается в строчном формате
        if (!token) {
            return res.status(401).json({message: "No authorization."})
        }

        //в случае если токен есть, его необходимо раскодировать
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded
        next()

    } catch (e) {
        res.status(401).json({message: "No authorization."})
    }
}