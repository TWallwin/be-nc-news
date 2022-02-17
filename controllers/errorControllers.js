exports.invalidPathError = (req, res, next) => {
  return res.status(404).send({ msg: "invalid path" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};
exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" && err.where.includes("1")) {
    return res.status(400).send({ msg: "value of inc_votes wrong type" });
  } else if (err.code === "22P02" && err.where.includes("2")) {
    return res.status(400).send({ msg: "invalid article_id" });
  }
  next(err);
};
exports.handle500s = (err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ msg: "server error" });
};
