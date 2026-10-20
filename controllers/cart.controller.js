const Service = require('../models/service.model');
const { calculateTotal } = require('../utils/cart');

const findItem = (cart, id) => cart.find(item => item.id === Number(id));


/* GET /cart - xem giỏ dịch vụ */
exports.view = (req, res) => {
    const items = req.session.cart || [];
    res.render('cart', {
        title: 'Giỏ dịch vụ',
        items,
        total: calculateTotal(items)
    });
};


/* POST /cart/add/:id - thêm dịch vụ vào giỏ */
exports.add = async (req, res, next) => {
    try {
        const service = await Service.getById(req.params.id);

        if (!service) {
            return res.redirect('/services');
        }

        req.session.cart = req.session.cart || [];
        const existingItem = findItem(req.session.cart, service.id);

        // Gộp dịch vụ trùng vào cùng một dòng trong giỏ thay vì thêm dòng mới.
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            req.session.cart.push({
                id: service.id,
                name: service.name,
                price: Number(service.price),
                quantity: 1
            });
        }

        res.redirect('/cart');
    } catch (e) {
        next(e);
    }
};

/* POST /cart/remove/:id - xóa 1 dịch vụ khỏi giỏ */
exports.remove = (req, res) => {
    req.session.cart = (req.session.cart || []).filter(
        item => item.id !== Number(req.params.id)
    );

    res.redirect('/cart');
};


/* POST /cart/clear - xóa toàn bộ giỏ */
exports.clear = (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
};
