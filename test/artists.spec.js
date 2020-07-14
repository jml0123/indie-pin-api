const knex = require("knex");
const app = require("../src/app");
const helpers = require("./helpers");
const { test } = require("mocha");

describe("Artists Endpoints", function () {
  let db;

  const serializeArtist = (artist) => ({
    type: "Feature",
    properties: {
      popularity: artist.popularity,
      spotify_id: artist.spotify_id,
      artist_name: artist.artist_name,
      genres: artist.genres,
      profile_img: artist.profile_img,
      neighborhood: artist.neighborhood,
      link_to_spotify: artist.link_to_spotify,
      social_links: artist.social_links,
    },
    geometry: {
      type: "Point",
      coordinates: artist.coordinates,
    },
  });

  const testArtists = helpers.makeArtistsArray();
  const testArtist = testArtists[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/artists`, () => {
    context(`Given no artists`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/artists").expect(200, []);
      });
    });
    context("Given there are artists in the database", () => {
      beforeEach("insert artists", () => helpers.seedArtists(db, testArtists));
      it("responds with 200 and all of the artists", () => {
        return supertest(app)
          .get("/api/artists")
          .expect(
            200,
            testArtists.map((a) => serializeArtist(a))
          );
      });
    });

    describe(`POST /artists`, () => {
      context(`Succesful POST`, () => {
        const newArtist = {
          artist_name: "artist 5",
          popularity: 88,
          spotify_id: "qfio2421RR",
          genres: ["test1", "test2"],
          profile_img: "http://link.fake",
          neighborhood: "Nanortalik, GL",
          link_to_spotify: "http://link.fake",
          coordinates: [-44.00043, 55.0],
          social_links: ["A", "B"],
        };
        it("Successfully adds a new artist", () => {
          return supertest(app)
            .post(`/api/artists`)
            .send(newArtist)
            .expect(201, serializeArtist(newArtist));
        });
      });
    });
    describe(`GET /api/artists/:artist_id`, () => {
      context(`Given no artists`, () => {
        beforeEach(() => helpers.seedArtists(db, testArtists));
        it(`responds with 404`, () => {
          const nonExistentArtistId = 213129312;
          return supertest(app)
            .get(`/api/artists/${nonExistentArtistId}`)
            .expect(404, {
              error: {
                message: `Artist doesn't exist!`,
              },
            });
        });
      });
      context("Given there are artists in the database", () => {
        beforeEach("insert artists", () =>
          helpers.seedArtists(db, testArtists)
        );
        it("responds with 200 and the specified artist", () => {
          const artistId = 3;
          return supertest(app)
            .get(`/api/artists/${artistId}`)
            .expect(200, serializeArtist(testArtists[2]));
        });
      });
    });
    describe(`PATCH /artists/:artist_id`, () => {
      context(`Given an artist exists`, () => {
        beforeEach(() => helpers.seedArtists(db, testArtists));
        const newData = {
          popularity: 99,
        };
        const editedArtist = testArtist;
        editedArtist.popularity = 99;
        it("Successfully edits artist", () => {
          return supertest(app)
            .patch(`/api/artists/${testArtist.id}`)
            .send(newData)
            .expect(200, serializeArtist(editedArtist));
        });
      });
    });
    describe(`DELETE /artists/:artist_id`, () => {
      context(`Given an artist exists`, () => {
        beforeEach(() => helpers.seedArtists(db, testArtists));
        it("Successfully deletes artist", () => {
          return supertest(app)
            .delete(`/api/artists/${testArtist.id}`)
            .expect(204)
            .then((res) => {
              return supertest(app)
                .get(`/api/artists/${testArtist.id}`)
                .expect(404);
            });
        });
      });
    });

    describe(`GET /api/artists/sp/:spotify_id`, () => {
      context(`Given no artists`, () => {
        beforeEach(() => helpers.seedArtists(db, testArtists));
        it(`responds with 404`, () => {
          const nonExistentSpotifyId = "awfaefaewf";
          return supertest(app)
            .get(`/api/artists/sp/${nonExistentSpotifyId}`)
            .expect(404, {
              error: {
                message: `Artist doesn't exist!`,
              },
            });
        });
      });
      context("Given there are artists in the database", () => {
        beforeEach("insert artists", () =>
          helpers.seedArtists(db, testArtists)
        );
        it("responds with 200 and the specified artist", () => {
          const valid_spotify_id = 12345678;
          return supertest(app)
            .get(`/api/artists/sp/${valid_spotify_id}`)
            .expect(200, serializeArtist(testArtist));
        });
      });
    });
    describe(`PATCH /artists/sp/:spotify_id`, () => {
      context(`Given an artist exists`, () => {
        beforeEach(() => helpers.seedArtists(db, testArtists));
        const newData = {
          popularity: 99,
        };
        const editedArtist = testArtist;
        editedArtist.popularity = 99;
        it("Successfully edits artist", () => {
          return supertest(app)
            .patch(`/api/artists/sp/${testArtist.spotify_id}`)
            .send(newData)
            .expect(200, serializeArtist(editedArtist));
        });
      });
    });
    describe(`DELETE /artists/sp/:spotify_id`, () => {
      context(`Given an artist exists`, () => {
        beforeEach(() => helpers.seedArtists(db, testArtists));
        it("Successfully deletes artist", () => {
          return supertest(app)
            .delete(`/api/artists/sp/${testArtist.spotify_id}`)
            .expect(204)
            .then((res) => {
              return supertest(app)
                .get(`/api/artists/${testArtist.spotify_id}`)
                .expect(404);
            });
        });
      });
    });
    describe(`GET /artists/top/50`, () => {
      context("Given there are artists in the database", () => {
        beforeEach("insert artists", () =>
          helpers.seedArtists(db, testArtists)
        );
        let topArtists = [...testArtists];
        topArtists = topArtists.sort((a, b) => b.popularity - a.popularity);
        it("responds with 200 and the artists from greatest to least, up to 50", () => {
          return supertest(app)
            .get(`/api/artists/top/50`)
            .expect(
              200,
              topArtists.map((a) => serializeArtist(a))
            );
        });
      });
    });
  });
});
