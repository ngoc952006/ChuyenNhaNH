const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

/* Toàn bộ route bên dưới chỉ dành cho tài khoản có role = admin */
router.use(requireAdmin);

/* GET /admin - danh sách dịch vụ */
router.get('/', adminController.dashboard);

/* GET /admin/services/new - form thêm dịch vụ */
router.get('/services/new', adminController.newServiceForm);

/* POST /admin/services - tạo dịch vụ mới */
router.post('/services', adminController.createService);

/* GET /admin/services/:id/edit - form sửa dịch vụ */
router.get('/services/:id/edit', adminController.editServiceForm);

/* PUT /admin/services/:id - cập nhật dịch vụ */
router.put('/services/:id', adminController.updateService);

/* DELETE /admin/services/:id - xóa dịch vụ */
router.delete('/services/:id', adminController.deleteService);

/* GET /admin/orders - danh sách toàn bộ đơn hàng của khách, có thể tìm theo tên khách (?search=) */
router.get('/orders', adminController.listOrders);

/* GET /admin/orders/:id - xem chi tiết 1 đơn hàng */
router.get('/orders/:id', adminController.orderDetail);

/* PUT /admin/orders/:id/status - cập nhật trạng thái đơn hàng */
router.put('/orders/:id/status', adminController.updateOrderStatus);

/* DELETE /admin/orders/:id - admin xóa đơn hàng của khách (bất kể trạng thái nào) */
router.delete('/orders/:id', adminController.deleteOrder);

module.exports = router;
