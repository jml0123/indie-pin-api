CREATE TABLE artists (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    spotify_id TEXT NOT NULL UNIQUE,
    artist_name TEXT NOT NULL,
    popularity INTEGER NOT NULL,
    coordinates FLOAT(6) [] NOT NULL,
    neighborhood text NOT NULL,
    link_to_spotify text NOT NULL,
    social_links text [] NOT NULL,
    profile_img text, 
    genres text [],
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL
)

