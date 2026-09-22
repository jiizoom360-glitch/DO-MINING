-- Foundation migration for DO-Mining

CREATE TABLE IF NOT EXISTS system_meta (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Basic trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_system_meta_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_system_meta_updated_at
BEFORE UPDATE ON system_meta
FOR EACH ROW
EXECUTE FUNCTION update_system_meta_updated_at();
