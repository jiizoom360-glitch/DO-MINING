-- Initial seed for DO-Mining foundation

INSERT INTO system_meta (key, value)
VALUES (
    'schema_version',
    '{"version": "0.1.0", "application_name": "DO-Mining", "environment": "local"}'::jsonb
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
