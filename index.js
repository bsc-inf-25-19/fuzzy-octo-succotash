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

// Endpoint for address find
app.get('/find', async (req, res) => {
    try {
        const [house_no, road_name, area_name] = req.query.input.split(', ');

        const client = await pool.connect();
        const result = await client.query(`
            SELECT id, road_name, area_name, house_no, postcode, latitude, longitude 
            FROM address_locations 
            WHERE 
                house_no = $1 AND
                road_name = $2 AND
                area_name = $3
        `, [house_no, road_name, area_name]);

        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing find query', err);
        res.status(500).json({ error: 'Internal server error on find' });
    }
})

// Endpoint for address search
// app.use(express.json());
app.get('/search', async (req, res) => {
    const searchText = req.query.text;

    try {
        const client = await pool.connect();
        const result = await client.query(`
        SELECT id, road_name, area_name, house_no, postcode, latitude, longitude 
        FROM address_locations 
        WHERE 
            house_no || ' ' || road_name || ' ' || postcode || ' ' || area_name ILIKE '%' || $1 || '%' OR
            road_name || ' ' || area_name || ' ' || postcode || ' ' || house_no ILIKE '%' || $1 || '%' OR
            area_name || ' ' || road_name || ' ' || postcode || ' ' || house_no ILIKE '%' || $1 || '%' OR
            road_name || ' ' || postcode || ' ' || area_name || ' ' || house_no ILIKE '%' || $1 || '%' OR
            area_name || ' ' || postcode || ' ' || road_name || ' ' || house_no ILIKE '%' || $1 || '%' OR
            postcode || ' ' || area_name || ' ' || road_name || ' ' || house_no ILIKE '%' || $1 || '%'
          
    `, [`%${searchText}%`]);

    client.release();
    res.json(result.rows);
} catch (err) {
    console.error('Error executing search query', err);
    res.status(500).json({ error: 'Internal server error on search' });
}
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
