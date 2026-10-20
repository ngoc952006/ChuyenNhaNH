/* Chặn truy cập nếu chưa đăng nhập, đưa về trang đăng nhập */
exports.requireLogin = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};


/* Chặn truy cập nếu không phải tài khoản admin */
exports.requireAdmin = (req, res, next) => {
    if (req.session.user?.role === 'admin') {
        return next();
    }

    res.status(403).send('Bạn không có quyền truy cập');
};
