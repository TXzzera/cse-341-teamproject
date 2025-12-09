const validator = require('../helpers/validate');

const saveReview = (req, res, next) => {
  const validationRule = {
    username: 'required|string',
    rating: 'required|integer',
    price: 'required|numeric',
    feedback: 'required|string'
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
  saveReview
};