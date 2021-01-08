DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS post_grams CASCADE;
DROP TABLE IF EXISTS comments;

CREATE TABLE users(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    profile_photo_url TEXT
);

CREATE TABLE post_grams(
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   user_id BIGINT REFERENCES users(id),
   photo_url TEXT NOT NULL,
   caption TEXT,
   tags TEXT[]
);

CREATE TABLE comments(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comment TEXT NOT NULL,
    comment_by BIGINT REFERENCES users(id),
    post BIGINT REFERENCES post_grams(id)
);
