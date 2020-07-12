
function makeArtistsArray() {
    return [
      {
        id: 1,
        artist_name: "artist 1",
        popularity: 23,
        spotify_id: "12345678",
        genres: ["test1", "test2"],
        profile_img: "http://link.fake",
        neighborhood: "Nanortalik, GL",
        link_to_spotify: "http://link.fake",
        coordinates: [-44.00043, 55.00000],
        social_links: ["A", "B"]
      },
      {
        id: 2,
        artist_name: "artist 2",
        popularity: 51,
        spotify_id: "1122334455",
        genres: ["test1", "test2"],
        profile_img: "http://link.fake",
        neighborhood: "Neighborhood 3",
        link_to_spotify: "http://link.fake",
        coordinates: [-124.00043, 95.00000],
        social_links: ["A", "B"]
      },
      {
        id: 3,
        artist_name: "artist 3",
        popularity: 2,
        spotify_id: "aawafeaf3",
        genres: ["test1", "test2"],
        profile_img: "http://link.fake",
        neighborhood: "Neighborhood 2",
        link_to_spotify: "http://link.fake",
        coordinates: [-55.00043, 3.00000],
        social_links: ["A", "B"]
      },
      {
        id: 4,
        artist_name: "artist 4",
        popularity: 77,
        spotify_id: "129ie912e",
        genres: ["test1", "test2"],
        profile_img: "http://link.fake",
        neighborhood: "Neighborhood 1",
        link_to_spotify: "http://link.fake",
        coordinates: [-114.00043, 55.00000],
        social_links: ["A", "B"]
      },
      {
        id: 5,
        artist_name: "artist 5",
        popularity: 95,
        spotify_id: "123213zef",
        genres: ["test1", "test2"],
        profile_img: "http://link.fake",
        neighborhood: "Neighborhood 1",
        link_to_spotify: "http://link.fake",
        coordinates: [-114.00043, 55.00000],
        social_links: ["A", "B"]
      },
    ];
  }
  
function makeExpectedArtist(artist) {
return {
    "type":"Feature",
    "properties":{
         "popularity": artist.popularity,
         "spotify_id": artist.spotify_id,
         "artist_name": artist.artist_name,
         "genres": artist.genres,
         "profile_img": artist.profile_img,
         "neighborhood": artist.neighborhood,
         "link_to_spotify": artist.link_to_spotify,
         "social_links": artist.social_links
    },
    "geometry":{
        "type":"Point",
        "coordinates": artist.coordinates
    }
};
}

function cleanTables(db) {
    return db.transaction((trx) =>
      trx
        .raw(
          `TRUNCATE
          artists
        `
        )
        .then(() =>
          Promise.all([
            trx.raw(`ALTER SEQUENCE artists_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('artists_id_seq', 0)`),
          ])
        )
    );
  }
  
  function seedArtists(db, artists) {
    return db.into("artists").insert(artists);
  }

  module.exports = {
      makeArtistsArray,
      cleanTables,
      seedArtists,
      makeExpectedArtist
  }

 