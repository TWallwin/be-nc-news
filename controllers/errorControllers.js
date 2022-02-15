exports.invalidPathError = (req, res, next) => {
  return res.status(404).send({ msg: "invalid path" });
};

exports.serverError = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
};
