exports.invalidPathError = (err, res, req) => {
  return res.status(404).send({ msg: "invalid path" });
};

exports.serverError = (err, res, req, next) => {
  if (err.status === 500) {
    return res.status(500).send({ msg: err.msg });
  }
};
