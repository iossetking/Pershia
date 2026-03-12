CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username       VARCHAR(255) NOT NULL,
    email          VARCHAR(255) UNIQUE NOT NULL,
    joined_at       TIMESTAMPTZ DEFAULT  NOW()

);

INSERT INTO users;
    ( username, email)
VALUES
    ('Miguel_Garcia', 'miguel@realm.io', ),
    ('Sebastian_Sanchez', 'sebas@realm.io');

DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE images(
    id_images UUID PRIMARY KEY gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    s3_url VARCHAR(1024) NOT NULL,
    s3_key VARCHAR(512) NOT NULL,
    formats VARCHAR(20),
    image_date TIMESTAMPTZ,
);

DROP TABLE IF EXISTS embbeding_images CASCADE
CREATE TABLE embbeding_images (
    id_embb UUID PRIMARY KEY get_random_uuid(),
    id_images UUID REFERENCES images(id_images) ON DELETE CASCADE,
    vector_char VECTOR(512) NOT NULL,
    start_date TIMESTAMPTZ, 
);

CREATE INDEX idx_embbedings_hnsw ON embbedings_images
USING hnsw (vector_char vector-cousine_ops);

DROP TABLE IF EXISTS analysis_ia;
CREATE TABLE analysis_ia (
    analysis_id UUID PRIMARY KEY gen_random_uuid(),
    id_images UUID REFERENCES images(id_images) ON DELETE CASCADE,
    text_extract TEXT,
    tags JSONB,
    descriptions TEXT,
    analysis_date TIMESTAMPTZ,
);

