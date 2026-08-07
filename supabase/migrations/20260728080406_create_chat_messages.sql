/*
# Create chat_messages table for customer chatbot

1. New Tables
- `chat_messages`
  - `id` (uuid, primary key)
  - `session_id` (text, identifies the visitor's chat session)
  - `sender` (text, either 'customer' or 'bot')
  - `message` (text, the chat message content)
  - `is_inquiry` (boolean, true when customer asks a question the bot can't answer — flagged for admin review)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `chat_messages`.
- Allow anon + authenticated CRUD (single-tenant, no sign-in app — chat is intentionally public).
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  sender text NOT NULL DEFAULT 'customer',
  message text NOT NULL,
  is_inquiry boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_messages" ON chat_messages;
CREATE POLICY "anon_update_chat_messages" ON chat_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);
