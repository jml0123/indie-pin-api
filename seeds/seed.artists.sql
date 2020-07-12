INSERT INTO artists
(spotify_id, artist_name, popularity, 
coordinates, neighborhood, link_to_spotify,
social_links, profile_img, genres)
VALUES
(
    '5LhTec3c7dcqBvpLRWbMcf', 
    'Madlib', 
    68, 
    ARRAY[-119.170898, 34.196411]::FLOAT(6)[],
    'Oxnard, US',
    'https://open.spotify.com/artist/5LhTec3c7dcqBvpLRWbMcf',
    ARRAY['https://open.spotify.com/artist/5LhTec3c7dcqBvpLRWbMcf']::TEXT[],
    'https://i.scdn.co/image/5df69b398c260be003acffc215956676388c21bc',
    ARRAY['alternative hip hop', 'cool beats']::TEXT[]
),
(
    '683gIqfxdjjg2sowYxBHIQ', 
    'Delroy Edwards', 
    22, 
    ARRAY[-118.243683, 34.052235]::FLOAT(6)[],
    'Los Angeles, US',
    'https://open.spotify.com/artist/683gIqfxdjjg2sowYxBHIQ',
    ARRAY['https://open.spotify.com/artist/683gIqfxdjjg2sowYxBHIQ', 'https://instagram.com']::TEXT[],
    'https://i.scdn.co/image/c2264701a33bdf1dc4e6bfdabf29c5107ac41bf4',
    ARRAY['techno', 'float house']::TEXT[]
),
(
    '6XoXNsXj8wck0oVUNwxcmF', 
    'MIA GLADSTONE', 
    50, 
    ARRAY[-74.271996, 40.729980]::FLOAT(6)[],
    'Maplewood, US',
    'https://open.spotify.com/artist/6XoXNsXj8wck0oVUNwxcmF',
    ARRAY['https://open.spotify.com/artist/6XoXNsXj8wck0oVUNwxcmF']::TEXT[],
    'https://i.scdn.co/image/cb2e4e4dabc8134e8b69e35a283873bd2efdcb4d',
    ARRAY['']::TEXT[]
);