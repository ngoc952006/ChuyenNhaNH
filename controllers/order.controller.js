const Order = require('../models/order.model');
const { calculateTotal } = require('../utils/cart');



exports.list = async (req, res, next) => {
    try {
        const orders = await Order.getByUser(req.session.user.id);
        res.render('orders', { title: 'Đơn hàng của tôi', orders });
    } catch (e) {
        next(e);
    }
};

exports.detail = async (req, res, next) => {
    try {
        const order = await Order.getById(req.params.id);

        // Không để người dùng xem đơn hàng thuộc tài khoản khác.
        if (!order || order.user_id !== req.session.user.id) {
            return res.status(404).render('404', {
                title: 'Không tìm thấy đơn hàng'
            });
        }

        res.render('order-detail', {
            title: `chi tiết đơn hàng`,
            order
        });
    } catch (e) {
        next(e);
    }
};


/* GET /orders/booking */
exports.bookingForm = (req, res) => {
    const items = req.session.cart || [];

    if (!items.length) {
        return res.redirect('/services');
    }

    res.render('booking', {
        title: 'Đặt lịch chuyển nhà',
        items,
        total: calculateTotal(items)
    });
};


/* POST /orders */
exports.create = async (req, res, next) => {
    try {
        const items = req.session.cart || [];

        if (!items.length) {
            return res.redirect('/cart');
        }

        const { fromAddress, toAddress, phone, moveDate, note } = req.body;

        if (!fromAddress || !toAddress || !phone || !moveDate) {
            return res.status(400).render('booking', {
                title: 'Đặt lịch chuyển nhà',
                items,
                total: calculateTotal(items),
                error: 'Vui lòng nhập đầy đủ thông tin bắt buộc.'
            });
        }

        await Order.create({
            userId: req.session.user.id,
            total: calculateTotal(items),
            fromAddress,
            toAddress,
            phone,
            moveDate,
            note: note || '',
            items
        });

        // Chỉ xóa giỏ hàng sau khi tạo đơn thành công để tránh mất dữ liệu khi có lỗi.
        req.session.cart = [];
        res.redirect('/orders');
    } catch (e) {
        next(e);
    }
};


/* DELETE /orders/:id - người dùng tự hủy đơn hàng của mình, chỉ khi đơn đang ở trạng thái "pending" */
exports.cancel = async (req, res, next) => {
    try {
        const order = await Order.getById(req.params.id);

        if (!order || order.user_id !== req.session.user.id) {
            return res.status(404).render('404');
        }

        if (order.status !== 'pending') {
            return res.status(400).redirect('/orders');
        }

        // Chỉ đơn đang chờ xử lý mới có thể bị hủy.
        await Order.remove(order.id);
        res.redirect('/orders');
    } catch (e) {
        next(e);
    }
};
