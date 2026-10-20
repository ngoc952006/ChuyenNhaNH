require('dotenv').config();

const express = require('express');
const path = require('path');
const port = process.env.PORT || 4000;
const session = require('express-session');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const { getCartCount } = require('./utils/cart');

const app = express();

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        defaultLayout: 'main',
//hàm tiện ích
        helpers: {
            currency: (number) =>
                new Intl.NumberFormat('vi-VN').format(
                    Number(number || 0)
                ) + 'đ',

            eq: (a, b) => a === b,

            initial: (name) =>
                (name || '?').trim().charAt(0).toUpperCase(),

            multiply: (a, b) =>
                Number(a || 0) * Number(b || 0),

             formatDate: (date) => {
                const d = new Date(date);
                return `${String(d.getDate()).padStart(2, '0')} tháng ${
                    String(d.getMonth() + 1).padStart(2, '0')
                } năm ${d.getFullYear()}`;
            },
        }
    })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'chuyen-nha-NH-secret',

        resave: false,
        saveUninitialized: false
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;

    res.locals.cartCount = getCartCount(req.session.cart || []);

    next();
});

app.use('/', require('./routes/home.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/services', require('./routes/service.routes'));
app.use('/orders', require('./routes/order.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/cart', require('./routes/cart.routes'));

app.use((req, res) => {
    res
        .status(404)
        .render('404', {
            title: 'Không tìm thấy trang'
        });
});

app.use((err, req, res, next) => {
    res
        .status(500)
        .render('500', {
            title: 'Lỗi máy chủ'
        });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server đang chạy tại cổng ${port}`);
});