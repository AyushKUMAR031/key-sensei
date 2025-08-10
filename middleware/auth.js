module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
};
