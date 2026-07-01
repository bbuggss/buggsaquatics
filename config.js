/* ============================================================
   SUPABASE CONFIG
   1. Create a free project at https://supabase.com
   2. Run schema.sql in the Supabase SQL editor (see SETUP.md)
   3. Project Settings → API → copy your Project URL and anon public key
   4. Paste them below. That's it — every page uses this file.
   ============================================================ */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"; // e.g. https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Shared client, used by auth.js and forum.js
window.sb = (SUPABASE_URL.startsWith("http"))
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!window.sb) {
  console.warn(
    "BuggsAquatics: Supabase isn't configured yet. " +
    "Edit config.js with your project URL and anon key to enable accounts and the forum. " +
    "See SETUP.md for step-by-step instructions."
  );
}
