-- SELECT objectid, house_no, ST_AsText(geom) AS coordinates FROM zcc_merged_plots;
-- SELECT objectid, ST_AsText(ST_Centroid(geom)) AS centroid_point
-- FROM zcc_merged_plots
-- WHERE ST_GeometryType(geom) = 'ST_MultiPolygon';

-- SELECT objectid, ST_AsText(geom) AS wkt_polygon
-- FROM zcc_merged_plots
-- WHERE ST_GeometryType(geom) = 'ST_Polygon';

-- SELECT objectid, plot_no, house_no, postcode, ST_AsText(ST_Centroid(geom)) AS coordinates
-- FROM zcc_merged_plots
-- WHERE ST_GeometryType(geom) = 'ST_MultiPolygon' AND ST_IsValid(geom);

-- SELECT house_no, road_name, postcode, area_name, ST_AsText(ST_Centroid(geom)) AS coordinates
-- FROM cbdandmatawale
-- WHERE ST_GeometryType(geom) = 'ST_MultiPolygon' AND ST_IsValid(geom);



-- CREATE TABLE address_locations (
-- 	id DOUBLE PRECISION,
--     area_name VARCHAR(255),
--     house_no VARCHAR(50),
--     road_name VARCHAR(100),
--     postcode INTEGER,
--     latitude DOUBLE PRECISION,
--     longitude DOUBLE PRECISION
-- );

-- INSERT INTO address_locations (id, area_name, house_no, road_name, postcode, latitude, longitude)
-- SELECT
--     objectid AS id,
--     area_name,
--     house_no,
--     road_name,
--     postcode,
--     ST_Y(ST_Centroid(geom)) AS latitude,
--     ST_X(ST_Centroid(geom)) AS longitude
-- FROM
--     cbdandmatawale
-- WHERE ST_GeometryType(geom) = 'ST_MultiPolygon' AND ST_IsValid(geom);





-- SELECT srid, srtext FROM spatial_ref_sys WHERE srtext ILIKE ‘%NAD83 / UTM zone 13n%;’;

-- SELECT id, road_name, area_name, house_no, latitude, longitude 
-- FROM address_locations
-- WHERE 
--     area_name ILIKE $1
--     OR house_no ILIKE $1
--     OR road_name ILIKE $1
--     OR postcode::VARCHAR ILIKE $1
--     OR latitude::VARCHAR ILIKE $1
--     OR longitude::VARCHAR ILIKE $1;

-- creating table thats clean
-- CREATE TABLE zomba_clean AS
-- SELECT *
-- FROM zcc_merged_plots
-- WHERE area_name IS NOT NULL AND gid IS NOT NULL;


-- INSERT INTO zomba_merged_plots (area_name, postcode)
-- VALUES ('CBD', 305200),
--        ('Ndola', 305201),
--        ('St Marys', 305203),
--        ('Nandolo', 305204),
--        ('Mulunguzi', 305208),
--        ('Matawale', 305212),
--        ('Sadzi', 305215)
	   
-- INSERT INTO your_table_name (area_name, postcode)
-- VALUES 
--     ('CBD', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305200 ELSE postcode END),
--     ('Ndola', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305201 ELSE postcode END),
--     ('St Marys', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305203 ELSE postcode END),
--     ('Nandolo', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305204 ELSE postcode END),
--     ('Mulunguzi', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305208 ELSE postcode END),
--     ('Matawale', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305212 ELSE postcode END),
--     ('Sadzi', CASE WHEN postcode IS NULL OR postcode = 0 THEN 305215 ELSE postcode END);

-- UPDATE zcc_merged_plots
-- SET postcode = 
--     CASE 
--         WHEN area_name = 'CBD' AND (postcode IS NULL OR postcode = 0) THEN 305200
--         WHEN area_name = 'Nandolo' AND (postcode IS NULL OR postcode = 0) THEN 305201
--         WHEN area_name = 'St Marys' AND (postcode IS NULL OR postcode = 0) THEN 305203
--         WHEN area_name = 'Nandolo' AND (postcode IS NULL OR postcode = 0) THEN 305204
--         WHEN area_name = 'Mulunguzi' AND (postcode IS NULL OR postcode = 0) THEN 305208
--         WHEN area_name = 'Matawale' AND (postcode IS NULL OR postcode = 0) THEN 305212
--         WHEN area_name = 'Sadzi' AND (postcode IS NULL OR postcode = 0) THEN 305215
--         ELSE postcode -- Keep the existing postcode if it doesn't meet the conditions
--     END;


-- This query updates the district and region columns where area_name is not null and either district or region is null. It assigns 'Zomba City' to the district column and 'Eastern Region' to the region column for those rows.
-- UPDATE zcc_merged_plots
-- SET 
--     district = COALESCE(district, 'Zomba City'),
--     region = COALESCE(region, 'Eastern Region')
-- WHERE area_name IS NOT NULL
-- AND (district IS NULL OR region IS NULL);


-- create a denormalized table addresses with a single address column containing all the address components concatenated together, along with the geom column copied from the original table.
-- CREATE TABLE addresses (
--     gid SERIAL PRIMARY KEY,
--     address TEXT,
--     geom GEOMETRY
-- );

-- INSERT INTO addresses (address, geom)
-- SELECT 
--     CONCAT_WS(', ', house_no, road_name, area_name, postcode, district, region) AS address,
--     geom
-- FROM zcc_merged_plots;



-- transform the centroid of the geometry to the WGS84 coordinate system (SRID 4326) and extract the latitude and longitude accordingly
-- SELECT 
--     address,
-- 	ST_Y(ST_Transform(ST_SetSRID(ST_Centroid(geom), 32736), 4326)) AS latitude,
--     ST_X(ST_Transform(ST_SetSRID(ST_Centroid(geom), 32736), 4326)) AS longitude
-- FROM addresses
-- WHERE ST_GeometryType(geom) = 'ST_MultiPolygon' AND ST_IsValid(geom);


