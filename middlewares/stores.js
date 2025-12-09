const validator = require('../helpers/validate');

const saveStore = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    location: 'required|string',
    URLwebsite: 'required|string'
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
  saveStore
};