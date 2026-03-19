-- ==============================================================================
-- PROYECTO: PershIA
-- IA: Qwen3.5-397B-A17B + FashionCLIP
-- STORAGE: Amazon S3
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- MÓDULO 1 Y 2: USUARIOS Y CATÁLOGO 
-- ==============================================================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_pw VARCHAR(255) NOT NULL,
    preferences TEXT, 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE garments (
    garment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    s3_key VARCHAR(512) NOT NULL UNIQUE, -- Amazon S3
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE garment_embeddings (
    embedding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    garment_id UUID REFERENCES garments(garment_id) ON DELETE CASCADE UNIQUE,
    image_vector VECTOR(512) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_garment_embeddings_hnsw ON garment_embeddings USING hnsw (image_vector vector_cosine_ops);

CREATE TABLE garment_analysis (
    analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    garment_id UUID REFERENCES garments(garment_id) ON DELETE CASCADE UNIQUE,
    ai_tags JSONB, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_garment_analysis_tags ON garment_analysis USING GIN (ai_tags);

-- ==============================================================================
-- MÓDULO 3: EL MOTOR
-- ==============================================================================
CREATE TABLE user_swipes (
    swipe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    garment_id UUID REFERENCES garments(garment_id) ON DELETE CASCADE,
    action VARCHAR(10) CHECK (action IN ('like', 'dislike', 'superlike')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, garment_id) 
);
CREATE INDEX idx_swipes_user ON user_swipes(user_id, action);

-- ==============================================================================
-- MÓDULO 4: LA MEMORIA DE LANGGRAPH
-- ==============================================================================

-- 1. Tabla para vincular a tu usuario con el Agente de LangGraph
CREATE TABLE agent_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- ¡CRÍTICO! Este es el ID que LangGraph usa internamente para recordar el estado
    langgraph_thread_id VARCHAR(255) UNIQUE NOT NULL, 
    
    title VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_agent_session_modtime BEFORE UPDATE ON agent_sessions FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 2. Tabla de Mensajes (Solo para lectura rápida del Frontend)
-- LangGraph guarda su propio estado, pero siempre es bueno tener una tabla limpia
-- para que React Native consulte el historial rápidamente sin despertar al agente.
CREATE TABLE chat_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES agent_sessions(session_id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'tool')), -- Añadimos 'tool' por LangGraph
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_session ON chat_messages(session_id, created_at);

-- NOTA: LangGraph creará automáticamente sus propias tablas ocultas 
-- (checkpoints, checkpoint_blobs) en esta misma base de datos usando `AsyncPostgresSaver`
