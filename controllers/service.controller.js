const Service = require('../models/service.model');


/* GET /services */
exports.list = async (req, res, next) => {
    try {
        const services = await Service.getAll();
        res.render('services', { title: 'Dịch vụ', services });
    } catch (e) {
        next(e);
    }
};


/* GET /services/:id */
exports.detail = async (req, res, next) => {
    try {
        const service = await Service.getById(req.params.id);

        if (!service) {
            return res.status(404).render('404');
        }

        res.render('service-detail', { title: service.name, service });
    } catch (e) {
        next(e);
    }
};
