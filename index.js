const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gis',
    password: 'JoelJones',
    port: 5432,
});

// Endpoint for address search
app.get('/search', async (req, res) => {
    const searchText = req.query.text;

    try {
        const client = await pool.connect();
        const result = await client.query(`
      SELECT house_no, coordinates FROM address_point
      WHERE house_no || ' ' || road_name || ' ' || postcode || ' ' || area_name ILIKE $1
    `, [`%${searchText}%`]);

        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
