const { readFile } = require("fs/promises");

exports.fetchEndpoints = () => {
  return readFile("./endpoints.json").then((body) => {
    return JSON.parse(body);
  });
};
