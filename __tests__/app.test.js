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

  describe("/api/topics - GET", () => {
    test("status 200 - responds with array representing topics table from database", () => {
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
  describe("/api/articles/article_id - GET", () => {
    test("status 200 - responds with article that matches article_id", () => {
      const article1 = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100
      };

      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual([article1]);
        });
    });
    test("status 404 - article not found", () => {
      return request(app)
        .get("/api/articles/15")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
    test("status 400 - bad request", () => {
      return request(app)
        .get("/api/articles/a")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
  });
  describe("/api/articles/article_id - PATCH", () => {
    test("status 200 - updates article", () => {});
    test("status 200 - responds with updated article", () => {
      const expectedData = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101
      };
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "1" })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toBe(expectedData);
        });
    });
    test("status 400 - invalid article_id ", () => {});
    test("status 404 - article not found", () => {});
    test("status 400 - malformed body eg{}", () => {});
    test("status 400 - body rejected by psql ie wrong type", () => {});
  });
});
