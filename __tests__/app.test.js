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
    test("status 200 - responds with array representing topics table", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String)
              })
            );
          });
        });
    });
  });
  describe("/api/articles/article_id - GET", () => {
    test("status 200 - responds with article corresponding to article_id", () => {
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
          expect(article).toEqual(article1);
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
          expect(msg).toBe("invalid article_id");
        });
    });
  });
  describe("/api/articles/article_id - PATCH", () => {
    test("status 200 - updates article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "2" })
        .then(() => {
          return request(app).get("/api/articles/1");
        })
        .then(({ body: { article } }) => {
          expect(article.votes).toEqual(102);
        });
    });
    test("status 200 - responds with updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "1" })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).toEqual(101);
        });
    });
    test("status 400 - invalid article_id ", () => {
      return request(app)
        .patch("/api/articles/a")
        .send({ inc_votes: "1" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid article_id");
        });
    });
    test("status 404 - article not found", () => {
      return request(app)
        .patch("/api/articles/15")
        .send({ inc_votes: "1" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
    test("status 400 - malformed body eg{}", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        });
    });
    test("status 400 - body rejected by psql ie wrong type", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "a" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        });
    });
  });
  describe("/api/users - GET", () => {
    test("status 200 - returns an array of username objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { usernames } }) => {
          expect(usernames).toHaveLength(4);
          usernames.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({ username: expect.any(String) })
            );
          });
        });
    });
  });
  describe("/api/articles/article_id/comments", () => {
    test("status 200 - should return an array of comments with correct properties", () => {
      const comments5 = [
        {
          body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
          votes: 16,
          author: "icellusedkars",
          comment_id: 14,
          article_id: 5,
          created_at: "2020-06-09T05:00:00.000Z"
        },
        {
          body: "I am 100% sure that we're not completely sure.",
          votes: 1,
          author: "butter_bridge",
          comment_id: 15,
          article_id: 5,
          created_at: "2020-11-24T00:08:00.000Z"
        }
      ];

      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual(comments5);
        });
    });
    test("status 404 - article does not exist", () => {
      return request(app)
        .get("/api/articles/20/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("data not found");
        });
    });
    test("status 400 - invalid article id", () => {
      return request(app)
        .get("/api/articles/a/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        });
    });
    test("status 404 - article has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("data not found");
        });
    });
  });
});
