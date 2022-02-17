const { fetchUsernames } = require("../models/userModels");

exports.getUsers = (req, res, next) => {
  fetchUsernames()
    .then((usernames) => {
      console.log(usernames);
      res.status(200).send({ usernames });
    })
    .catch(next);
};
