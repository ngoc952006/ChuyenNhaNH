const router = require('express').Router();
const { requireLogin } = require('../middleware/auth');
const orderController = require('../controllers/order.controller');


/* GET /orders - danh sách đơn hàng của người dùng đang đăng nhập */
router.get('/', requireLogin, orderController.list);

router.get('/booking', requireLogin, orderController.bookingForm);
router.get('/:id', requireLogin, orderController.detail);
router.post('/', requireLogin, orderController.create);

/* DELETE /orders/:id - khách tự hủy đơn hàng (chỉ khi đơn còn ở trạng thái pending) */
router.delete('/:id', requireLogin, orderController.cancel);

module.exports = router;
