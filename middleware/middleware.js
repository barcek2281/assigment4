async function authenticateUser(req, res, next) {
    if (!req.session.user || !req.session.user._id) {
        return res.redirect("/login"); // Если нет сессии, отправляем на логин
    }
    next()
}

module.exports = authenticateUser;