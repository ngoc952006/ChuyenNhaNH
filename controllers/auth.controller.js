const bcrypt = require('bcryptjs');
const User = require('../models/user.model');


/* GET /auth/login */
exports.loginForm = (req, res) => {
    res.render('login', { title: 'Đăng nhập' });
};


/* POST /auth/login */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        const passwordMatches =
            user && (await bcrypt.compare(password, user.password));

        if (!passwordMatches) {
            return res.render('login', {
                title: 'Đăng nhập',
                error: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Chỉ lưu thông tin cần thiết vào session, không lưu mật khẩu.
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.redirect('/');
    } catch (e) {
        next(e);
    }
};


/* GET /auth/register */
exports.registerForm = (req, res) => {
    res.render('register', { title: 'Đăng ký' });
};


/* POST /auth/register */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Hash mật khẩu trước khi lưu để không lưu mật khẩu dạng văn bản thuần.
        const hash = await bcrypt.hash(password, 10);

        await User.create(name, email, hash);
        res.redirect('/auth/login');
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            return res.render('register', {
                title: 'Đăng ký',
                error: 'Email có thể đã tồn tại'
            });
        }
        next(e);
    }
};


/* POST /auth/logout */
exports.logout = (req, res, next) => {
    req.session.destroy((e) => {
        if (e) {
            return next(e);
        }
        res.redirect('/');
    });
};
