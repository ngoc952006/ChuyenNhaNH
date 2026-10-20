const Service = require('../models/service.model');

/* GET / */
exports.index = async (req, res, next) => {
    try {
        const services = await Service.getLatest(4);
        res.render('home', {
            title: 'ChuyểnNhàNH - Chuyển nhà chuyên nghiệp',
            services
        });
    } catch (e) {
        next(e);
    }
};
