
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const request = require("supertest");

beforeEach(() => seed(data));

afterAll(() => db.end());
describe("app", () => {
  test("status 404 - invalid path", () => {
    return request(app)
      .get("/n")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid path");
      });
  });
  test("status 500 - internal server error", () => {}); // TODO how to test??

  describe("/api/topics - GET", () => {
    test("status 200 - ok", () => {
      const expectedTopics = [
        //expected test data
        {
          description: "The man, the Mitch, the legend",
          slug: "mitch"
        },
        {
          description: "Not dogs",
          slug: "cats"
        },
        {
          description: "what books are made of",
          slug: "paper"
        }
      ];

      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual(expectedTopics);
        });
    });
  });
});

