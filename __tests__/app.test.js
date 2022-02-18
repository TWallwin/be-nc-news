const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const request = require("supertest");
let compareDates;

beforeEach(() => {
  return seed(data).then(() => {
    compareDates = (a, b) => {
      //creating comparison function
      if (Date.parse(a) > Date.parse(b)) {
        return -1;
      }
      if (Date.parse(b) > Date.parse(a)) {
        return 1;
      }

      return 0;
    };
  });
});

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
        votes: 100,
        comment_count: "11"
      };

      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(article1);
        });
    });
    test("status 200 - response object has comment_count property", () => {
      const article1 = {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 0,
        comment_count: "0",
        article_id: 2
      };

      return request(app)
        .get("/api/articles/2")
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

  describe("/api/articles - GET", () => {
    test("status 200 - responds with an array of articles data", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_id: expect.any(Number)
              })
            );
          });
        });
    });
    test("status 200 - articles should be sorted ", () => {
      const compareDates = (a, b) => {
        //creating comparison function
        if (Date.parse(a) > Date.parse(b)) {
          return -1;
        }
        if (Date.parse(b) > Date.parse(a)) {
          return 1;
        }

        return 0;
      };

      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            compare: compareDates
          });
        });
    });
    test("status 200 - articles should contain a comment count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                comment_count: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_id: expect.any(Number)
              })
            );
          });
        });
    });
    test("status 200 - comment_count should be the number of comments on the article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].comment_count).toBe("2");
          expect(articles[1].comment_count).toBe("1");
        });
    });
    describe("queries:", () => {
      test("status 200 - should accept sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("... defaults to date", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
              compare: compareDates
            });
          });
      });
      test("status 200 - should accept order query...", () => {
        return request(app)
          .get("/api/articles?order=asc&sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", { descending: false });
          });
      });
      test("...defaults to desc", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("status 200 - should accept topic query which filters by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  title: expect.any(String),
                  comment_count: expect.any(String),
                  topic: "mitch",
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  article_id: expect.any(Number)
                })
              );
            });
          });
      });
      test("status 400 - sort_by value invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=a")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid query value");
          });
      });
      test("status 400 - order value invalid", () => {
        return request(app)
          .get("/api/articles?order=n")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid query value");
          });
      });
      test("status 400 - topic value invalid", () => {
        return request(app)
          .get("/api/articles?topic=a")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid query value");
          });
      });
      test("status 400 - invalid query parameter", () => {
        return request(app)
          .get("/api/articles/?a=a")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid query parameter");
          });
      });
    });
  });
  describe("/api/articles/article_id/comments - GET", () => {
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
          expect(msg).toBe("article not found");
        });
    });
    test("status 400 - invalid article id", () => {
      return request(app)
        .get("/api/articles/a/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid article_id");
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
  describe("/api/articles/:article_id/comments - POST", () => {
    test("status 200 - adds a comment to the comment table", () => {
      const newComment = {
        username: "lurker",
        body: "first ever review"
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(200)
        .then(() => {
          return request(app).get("/api/articles/2/comments");
        })
        .then(({ body: { comments } }) => {
          expect(comments[0].body).toBe("first ever review");
        });
    });

    test("status 200 - returns the added comment", () => {
      const newComment = {
        username: "lurker",
        body: "first ever review"
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: "first ever review",
              votes: 0,
              author: "lurker",
              article_id: 2,
              created_at: expect.any(String)
            })
          );
        });
    });
    test("status 404 - article not found", () => {
      const newComment = {
        username: "lurker",
        body: "first ever review"
      };
      return request(app)
        .post("/api/articles/20/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
    test("status 400 - invalid article_id", () => {
      const newComment = {
        username: "lurker",
        body: "first ever review"
      };
      return request(app)
        .post("/api/articles/a/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid article_id");
        });
    });
    test("status 400 - comment added invalid form", () => {
      const newComment = {
        u: "lurker",
        b: "first ever review"
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment added invalid form");
        });
    });
    test("status 400 - comment added invalid data type", () => {
      const newComment = {
        username: "lurker",
        body: 234
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid body");
        });
    });
    test("status 404 - username does not exist", () => {
      const newComment = {
        username: "a",
        body: 234
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username does not exist");
        });
    });
  });
  describe("/api/comments/comment_id - DELETE", () => {
    test("status 202 - should delete comment by comment_id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app).get("/api/articles/9/comments/");
        })
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(1);
        });
    });
    test("status 404 - comment not found", () => {
      return request(app)
        .delete("/api/comments/30")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment not found");
        });
    });
    test("status 400 - comment_id invalid", () => {
      return request(app)
        .delete("/api/comments/a")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid comment_id");
        });
    });
  });
});
