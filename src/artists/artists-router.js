const path = require("path");
const express = require("express");
const ArtistsService = require("./artists-service");
const { json } = require("express");
const _reverseGeocoder = require("../helpers/_reverseGeocoder")

const artistsRouter = express.Router()
const jsonParser = express.json();


const serializeArtist = (artist) => ({
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
})

artistsRouter.route("/")
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        ArtistsService.getAllArtists(knexInstance)
        .then((artists) => {
            res.json(artists.map(serializeArtist))
        })
        .catch(next)
    })
    .post(jsonParser, async (req, res, next) => {
        console.log(req.body)
        const knexInstance = req.app.get('db');
        const {
            artist_name, spotify_id, popularity, 
            coordinates, genres, profile_img,
            link_to_spotify, social_links
        } = req.body
        const newArtist = {
            artist_name, 
            spotify_id, 
            popularity, 
            coordinates,
            genres,
            profile_img,
            link_to_spotify, 
            social_links,
        }
        await _reverseGeocoder(coordinates[0], coordinates[1])
        .then(place => {
            if (!place) {
                newArtist.neighborhood = "Location Unknown"
            }
            newArtist.neighborhood = `${place.record.name}, ${place.record.countryCode}`
            for (const [key, value] of Object.entries(newArtist)) {
                if (value == null) {
                    return res.status(400).json({
                        error: {message: `Missing ${key} in request body`}
                    });
                }
            }
            ArtistsService.insertArtist(knexInstance, newArtist)
                .then((artist) => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${artist.id}`))
                        .json(serializeArtist(artist))
                })
                .catch(next)
            })      
        })

    artistsRouter
        .route("/:artist_id")
        .all((req, res, next) => {
            knexInstance = req.app.get("db");
            ArtistsService.getByArtistId(knexInstance, req.params.artist_id)
              .then((artist) => {
                if (!artist) {
                  return res.status(404).json({
                    error: { message: `Artist doesn't exist!` },
                  });
                }
                res.artist = artist;
                next();
              })
              .catch(next);
          })
        .get((req, res, next) => {
            res.json(serializeArtist(res.artist))
        })
        // Unusued by client!
        .delete((req, res, next) => {
            ArtistsService.deleteArtist(knexInstance, req.params.artist_id)
                .then((AffectedEntries) => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next)=>{
            const knexInstance = req.app.get("db");
            const { 
                coordinates, genres, profile_img,
                social_links, popularity
            } = req.body;
            
            const updatedArtist = { 
                coordinates, genres, profile_img,
                social_links, popularity
            }
            
            ArtistsService.updateArtist(
                knexInstance,
                req.params.artist_id,
                updatedArtist
            )
            .then((artist) => {
                res.status(200)
                res.json(serializeArtist(artist))
            })
            .catch(next)
        });
    
        artistsRouter
        .route("/sp/:spotify_id")
        .all((req, res, next) => {
            knexInstance = req.app.get("db");
            ArtistsService.getByArtistSpotifyId(knexInstance, req.params.spotify_id)
              .then((artist) => {
                if (!artist) {
                  return res.status(404).json({
                    error: { message: `Artist doesn't exist!` },
                  });
                }
                res.artist = artist;
                next();
              })
              .catch(next);
          })
        .get((req, res, next) => {
            res.json(serializeArtist(res.artist))
        })
        // Unusued by client!
        .delete((req, res, next) => {
            ArtistsService.deleteArtistBySpotifyId(knexInstance, req.params.spotify_id)
                .then((AffectedEntries) => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next)=>{
            const knexInstance = req.app.get("db");
            const { 
                coordinates, genres, profile_img,
                social_links, popularity
            } = req.body;
            
            const updatedArtist = { 
                coordinates, genres, profile_img,
                social_links, popularity
            }
            
            ArtistsService.updateArtistBySpotifyId(
                knexInstance,
                req.params.spotify_id,
                updatedArtist
            )
            .then((artist) => {
                res.status(200)
                res.json(serializeArtist(artist))
            })
            .catch(next)
        });

    artistsRouter
        .route("/top/50")
        .get((req, res, next) => {
            const knexInstance = req.app.get("db");
            ArtistsService.getTopArtists(knexInstance)
            .then((artists) => {
                res.json(artists.map(serializeArtist))
            })
            .catch(next)
        })
    
module.exports = artistsRouter;
