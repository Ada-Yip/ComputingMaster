const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
const databaseKey = process.env.DATABASE_ANON_KEY;

if (!databaseUrl || !databaseKey) {
    console.error("Error: Missing DATABASE_URL or DATABASE_ANON_KEY");
    process.exit(1);
}

const database = createClient(databaseUrl, databaseKey);

console.log("Database initialized");

module.exports = database;