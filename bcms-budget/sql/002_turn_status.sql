-- T = turned in. clear = reviewed and cleared.
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS turn_status TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'accounts_turn_status_check'
  ) THEN
    ALTER TABLE accounts
      ADD CONSTRAINT accounts_turn_status_check
      CHECK (turn_status IS NULL OR turn_status IN ('T', 'clear'));
  END IF;
END $$;
