const validator = require('../helpers/validate');

const saveShirt = (req, res, next) => {
  const validationRule = {
    brand: 'required|string',
    club: 'required|string',
    year: 'required|integer',
    model: 'required|string',
    color: 'required|string',
    image: 'required|string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveShirt
};