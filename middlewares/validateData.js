const { validationResult } = require("express-validator");

//check if there are any error in the fields
const validateData = (req, res, next) => {
  const hasErrors = validationResult(req);

  if (!hasErrors.isEmpty()) {
    const errorsList = hasErrors.errors.map((e) => ({error: e.msg, field: e.param}));
    return res.json({ error: true, msg: errorsList, type:'validate' });
  }
  next();
};

module.exports = validateData;
