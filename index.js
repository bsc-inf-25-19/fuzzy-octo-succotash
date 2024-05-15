const express = require('express');
const morgan = require('morgan');
const parser = require('fast-xml-parser');

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
    const acceptedType = req.accepts('json', 'xml'); // Check accepted types


    try {
        // Split the search text into separate terms
        const searchTerms = searchText.split(' ');

        // Construct the tsquery string
        const tsqueryString = searchTerms.join(' & ');

        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                gid AS id, house_no, road_name, area_name, postcode, district, region,
                ST_Y(ST_Transform(ST_SetSRID(ST_Centroid(geom), 32736), 4326)) AS latitude, 
                ST_X(ST_Transform(ST_SetSRID(ST_Centroid(geom), 32736), 4326)) AS longitude 
            FROM 
                zcc_merged_plots 
            WHERE 
                to_tsvector(house_no || ' ' || road_name || ' ' || area_name|| ' ' || postcode || ' ' || district || ' ' || region  || ' ' || area_name) @@ to_tsquery($1) 
                AND ST_GeometryType(geom) = 'ST_MultiPolygon' 
                AND ST_IsValid(geom);     
        `, [tsqueryString]);

        client.release();
        if (acceptedType === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.json(result.rows);
        } else if (acceptedType === 'xml') {
            // Implement XML serialization logic here (using a library)
            const xmlData = convertDataToXml(result.rows); // Hypothetical function
            res.setHeader('Content-Type', 'application/xml');
            res.send(xmlData);
        } else {
            res.status(406).send('Not Acceptable: Unsupported content type');
        }
    } catch (err) {
        console.error('Error executing search query', err);
        res.status(500).json({ error: 'Internal server error on search' });
    }
})
function convertDataToXml(data) {
    const options = {
      attributeNamePrefix: "", // Optional: remove prefixes from attributes
      textNodeName: "text", // Optional: change the default text node name
    };
    const xmlParser = new parser.Parser(options);
    const jsonObj = { root: { element: data } }; // Wrap data in a root element
    const xmlData = xmlParser.stringify(jsonObj);
    return xmlData;
  }
app.use(morgan('combined')); // enable development logging

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
