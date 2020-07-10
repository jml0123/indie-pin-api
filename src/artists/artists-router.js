const path = require("path");
const express = require("express");
const ArtistsService = require("./artists-service");
const { json } = require("express");

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
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const {
            artist_name, spotify_id, popularity, 
            coordinates, genres, profile_img,
            link_to_spotify, social_links, neighborhood
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
        // Remove neighborhood from request body!! 
        // call function to get neighborhood here based on coordaintes
        newArtist.neighborhood = neighborhood 
        for (const [key, value] of Object.entries(newArtist)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing ${key} in request body`}
                });
            }
        }
        // Find neighborhood based on coords here
        ArtistsService.insertArtist(knexInstance, newArtist)
            .then((artist) => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${artist.id}`))
                    .json(serializeArtist(artist))
            })
            .catch(next)
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
                social_links
            } = req.body;
            
            const updatedArtist = { 
                coordinates, genres, profile_img,
                social_links
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
        .route("/top/75_under")
        .get((req, res, next) => {
            const knexInstance = req.app.get("db");
            ArtistsService.getTopArtists(knexInstance)
            .then((artists) => {
                res.json(artists.map(serializeArtist))
            })
            .catch(next)
        })

    artistsRouter
        .route("/top/50_under")
        .get((req, res, next) => {
            const knexInstance = req.app.get("db");
            ArtistsService.getTopArtists50(knexInstance)
            .then((artists) => {
                res.json(artists.map(serializeArtist))
            })
            .catch(next)
        })
    
    artistsRouter
        .route("/top/20_under")
        .get((req, res, next) => {
            const knexInstance = req.app.get("db");
            ArtistsService.getTopArtists20(knexInstance)
            .then((artists) => {
                res.json(artists.map(serializeArtist))
            })
            .catch(next)
        })
       
    artistsRouter
        .route("/top/10_under")
        .get((req, res, next) => {
            const knexInstance = req.app.get("db");
            ArtistsService.getTopArtists10(knexInstance)
            .then((artists) => {
                res.json(artists.map(serializeArtist))
            })
            .catch(next)
        })
    
module.exports = artistsRouter;
