module.exports.isLoggedIn = (req, res, next) => {
    if(!req.session.user){
        // req.session.returnTo =  req.originalUrl;
        // console.log(req.session.returnTo);
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}