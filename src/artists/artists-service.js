const ArtistsService = {
    getAllArtists(knex) {
      return knex.select('*').from('artists');
    },
    getTopArtists(knex) {
        return knex.select('*')
        .from('artists')
        .where('popularity', '<', 75)
        .orderBy('popularity', 'desc')
        .limit(50);
    },
    getTopArtists50(knex) {
        return knex.select('*')
        .from('artists')
        .where('popularity', '<', 50)
        .orderBy('popularity', 'desc')
        .limit(50);
    },
    getTopArtists20(knex) {
        return knex.select('*')
        .from('artists')
        .where('popularity', '<', 20)
        .orderBy('popularity', 'desc')
        .limit(25);
    },
    getTopArtists10(knex) {
        return knex.select('*')
        .from('artists')
        .where('popularity', '<', 10)
        .orderBy('popularity', 'desc')
        .limit(25);
    },
    insertArtist(knex, newArtist) {
      return knex
        .insert(newArtist)
        .into('artists')
        .returning('*')
        .then((rows) => {
          return rows[0];
        });
    },
    getByArtistId(knex, id) {
      return knex.from('artists').select('*').where('id', id).first();
    },
    getByArtistSpotifyId(knex, spotify_id) {
       return knex.from('artists').select('*').where({ spotify_id }).first();
    },
    deleteArtist(knex, id) {
      return knex.from('artists').where({ id }).delete();
    },
    deleteArtistBySpotifyId(knex, spotify_id) {
        return knex.from('artists').where({ spotify_id }).delete();
    },
    updateArtistsById(knex, id, updatedArtist) {
        return knex
          .from('artists')
          .where({ id })
          .update(updatedArtist)
          .returning('*')
          .then((rows) => {
            return rows[0];
          });
      },
    updateArtistBySpotifyId(knex, spotify_id, updatedArtist) {
      return knex
        .from('artists')
        .where({ spotify_id })
        .update(updatedArtist)
        .returning('*')
        .then((rows) => {
          return rows[0];
        });
    },
  };

  module.exports = ArtistsService;