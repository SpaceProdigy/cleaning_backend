export const handleSaveError = (error, data, next) => {
  error.status = 400;
  next();
};

export const runValidatePreUpdate = function (next) {
  this.options.runValidator = true;
  next();
};
