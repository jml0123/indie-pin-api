## Indie Pin (API)
This is the API repository for Indie Pin, a live and interactive heatmap of independent music culture. For the client repo, visit  *[here](https://github.com/jml0123/indie-pin-client)*.


[Link to Live Site](https://indie-pin-client.jml0123.vercel.app/)

## Technology Used
- PostgreSQL
- Express.js
- Node.js 
- React.js
- Mapbox-gl
- Spotify API
 

## API Docs

### Artists Endpoints  `/api/artists`
**Get and Post Artists**
- GET /artists
- POST /artists

**Get Top Artists**
- GET /artists/top/50

**By Artist ID**
- GET /artists/:artist_id
- PATCH /artists/:artist_id 
- DELETE /artists/:artist_id

**By Spotify Artist ID**
- GET /artists/sp/:spotify_id
- PATCH /artists/sp/:spotify_id
- DELETE /artists/sp/:spotify_id
