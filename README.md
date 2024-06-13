## Introduction

The Malawi Geocoder project consists of a PostgreSQL database with PostGIS extension to store geospatial data, a NodeJS API to handle search requests, and a Flutter mobile app as the geocoding assistant. The system allows users to search for addresses and view their locations on a map.

---

## API

The API handles search requests and interacts with the PostgreSQL database.

### Technologies Used (API)

- Node.js
- Express.js
- PostgreSQL
- PostGIS

### Setup and Installation (API)

#### Prerequisites

- Node.js and npm
- PostgreSQL with PostGIS extension

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/bsc-inf-25-19/fuzzy-octo-succotash
   cd repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file based on the `.env.example` template and fill in your database credentials.

4. Start the API server:
   ```bash
   npm start
   ```

### Usage (API)

The API provides endpoints to search for addresses and retrieve geospatial data.

### API Endpoints

- **/find**: Find an address by house number, road name, and area name.
- **/search**: Search for addresses using a text query.

#### Example Request
```bash
GET /search?text=Area+51
```

---