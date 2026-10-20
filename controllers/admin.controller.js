const Service = require('../models/service.model');
const Order = require('../models/order.model');

/* Các handler này được bảo vệ bởi requireAdmin trong routes/admin.routes.js. */

/* GET /admin - danh sách dịch vụ */
exports.dashboard = async (req, res, next) => {
    try {
        const services = await Service.getAll();
        const error = req.query.error === 'service-in-use'
            ? 'Không thể xóa dịch vụ này vì dịch vụ đã được sử dụng trong đơn hàng. Lịch sử đơn hàng được giữ nguyên.'
            : null;

        res.render('admin/index', { title: 'Quản trị', services, error });
    } catch (e) {
        next(e);
    }
};

/* GET /admin/services/new - form thêm dịch vụ */
exports.newServiceForm = (req, res) => {
    res.render('admin/service-form', {
        title: 'Thêm dịch vụ',
        service: null
    });
};

/* POST /admin/services - tạo dịch vụ mới */
exports.createService = async (req, res, next) => {
    try {
        await Service.create(req.body);
        res.redirect('/admin');
    } catch (e) {
        next(e);
    }
};

/* GET /admin/services/:id/edit - form sửa dịch vụ */
exports.editServiceForm = async (req, res, next) => {
    try {
        const service = await Service.getById(req.params.id);
        res.render('admin/service-form', { title: 'Sửa dịch vụ', service });
    } catch (e) {
        next(e);
    }
};

/* PUT /admin/services/:id - cập nhật dịch vụ */
exports.updateService = async (req, res, next) => {
    try {
        await Service.update(req.params.id, req.body);
        res.redirect('/admin');
    } catch (e) {
        next(e);
    }
};

/* DELETE /admin/services/:id - xóa dịch vụ */
exports.deleteService = async (req, res, next) => {
    try {
        await Service.remove(req.params.id);
        res.redirect('/admin');
    } catch (e) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.redirect('/admin?error=service-in-use');
        }
        next(e);
    }
};

/* GET /admin/orders - danh sách đơn hàng, có thể tìm theo tên khách (?search=) */
exports.listOrders = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const orders = await Order.getAll(search);

        res.render('admin/orders', {
            title: 'Quản lý đơn hàng',
            orders,
            search
        });
    } catch (e) {
        next(e);
    }
};

/* GET /admin/orders/:id - xem chi tiết một đơn hàng */
exports.orderDetail = async (req, res, next) => {
    try {
        const order = await Order.getById(req.params.id);

        if (!order) {
            return res.status(404).render('404');
        }

        res.render('admin/order-detail', {
            title: `Đơn hàng #${order.id}`,
            order
        });
    } catch (e) {
        next(e);
    }
};

/* PUT /admin/orders/:id/status - cập nhật trạng thái đơn hàng */
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(400).send('Trạng thái không hợp lệ');
        }

        await Order.updateStatus(req.params.id, req.body.status);
        res.redirect(`/admin/orders/${req.params.id}`);
    } catch (e) {
        next(e);
    }
};

/* DELETE /admin/orders/:id - admin xóa đơn hàng của khách, bất kể trạng thái */
exports.deleteOrder = async (req, res, next) => {
    try {
        await Order.remove(req.params.id);
        res.redirect('/admin/orders');
    } catch (e) {
        next(e);
    }
};
