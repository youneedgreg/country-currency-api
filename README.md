# Country Currency & Exchange API

A RESTful API that fetches country data from external APIs, stores it in a MySQL database, and provides CRUD operations with filtering and sorting capabilities.

## 🚀 Features

- Fetch and cache country data from RestCountries API
- Fetch real-time exchange rates
- Calculate estimated GDP for each country
- Filter countries by region and currency
- Sort countries by GDP
- Generate summary images with top 5 countries
- RESTful endpoints with comprehensive error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/youneedgreg/country-currency-api.git
cd country-currency-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=countries_db
```

### 4. Create MySQL database
```sql
CREATE DATABASE countries_db;
```

### 5. Run the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. **POST /countries/refresh**
Fetch all countries and exchange rates, then cache them in the database.

**Request:**
```bash
curl -X POST http://localhost:3000/countries/refresh
```

**Response:**
```json
{
  "message": "Countries refreshed successfully",
  "processed": 250,
  "inserted": 200,
  "updated": 50
}
```

---

#### 2. **GET /countries**
Get all countries from the database with optional filters and sorting.

**Query Parameters:**
- `region` - Filter by region (e.g., `Africa`, `Europe`)
- `currency` - Filter by currency code (e.g., `NGN`, `USD`)
- `sort` - Sort by GDP (`gdp_desc` or `gdp_asc`)

**Examples:**
```bash
# Get all countries
curl http://localhost:3000/countries

# Filter by region
curl http://localhost:3000/countries?region=Africa

# Filter by currency
curl http://localhost:3000/countries?currency=NGN

# Sort by GDP (descending)
curl http://localhost:3000/countries?sort=gdp_desc
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-26T18:00:00.000Z"
  }
]
```

---

#### 3. **GET /countries/:name**
Get a specific country by name.

**Request:**
```bash
curl http://localhost:3000/countries/Nigeria
```

**Response:**
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-26T18:00:00.000Z"
}
```

---

#### 4. **DELETE /countries/:name**
Delete a country record by name.

**Request:**
```bash
curl -X DELETE http://localhost:3000/countries/Nigeria
```

**Response:**
```json
{
  "message": "Country deleted successfully"
}
```

---

#### 5. **GET /countries/status**
Get total countries and last refresh timestamp.

**Request:**
```bash
curl http://localhost:3000/countries/status
```

**Response:**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T18:00:00.000Z"
}
```

---

#### 6. **GET /countries/image**
Get the generated summary image.

**Request:**
```bash
curl http://localhost:3000/countries/image
```

**Response:**
Returns a PNG image with:
- Total number of countries
- Top 5 countries by estimated GDP
- Last refresh timestamp

---

## 🔒 Error Responses

The API returns consistent JSON error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```

### 404 Not Found
```json
{
  "error": "Country not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message here"
}
```

### 503 Service Unavailable
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from [API name]"
}
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **HTTP Client:** Axios
- **Image Generation:** Jimp
- **Environment Variables:** dotenv

---

## 📦 Dependencies
```json
{
  "axios": "^1.12.2",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jimp": "^0.22.10",
  "mysql2": "^3.15.3"
}
```

---

## 🌐 External APIs Used

1. **RestCountries API**
   - URL: `https://restcountries.com/v2/all`
   - Purpose: Fetch country data (name, capital, region, population, flag, currencies)

2. **Exchange Rate API**
   - URL: `https://open.er-api.com/v6/latest/USD`
   - Purpose: Fetch real-time currency exchange rates

---

## 📁 Project Structure
```
country-currency-api/
├── cache/                      # Generated images
├── src/
│   ├── controllers/
│   │   └── countryController.js    # Request handlers
│   ├── models/
│   │   └── database.js             # Database connection
│   ├── routes/
│   │   └── countryRoutes.js        # API routes
│   ├── services/
│   │   ├── countryService.js       # Business logic
│   │   ├── externalApi.js          # External API calls
│   │   └── imageService.js         # Image generation
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
├── .env                        # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Deployment

### Railway Deployment

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and add MySQL database

3. **Get database credentials** from Railway dashboard

4. **Update environment variables** in Railway:
```
   PORT=3000
   DB_HOST=<railway-mysql-host>
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=<railway-mysql-database>
```

5. **Deploy from GitHub:**
   - Connect your GitHub repository
   - Railway will automatically detect Node.js and deploy
   - Use `npm start` as the start command

6. **Initial data load:**
   After deployment, make a POST request to `/countries/refresh` to populate the database.

---

## 🧪 Testing

### Test all endpoints:
```bash
# 1. Refresh countries
curl -X POST http://localhost:3000/countries/refresh

# 2. Get all countries
curl http://localhost:3000/countries

# 3. Filter by region
curl http://localhost:3000/countries?region=Africa

# 4. Get specific country
curl http://localhost:3000/countries/Nigeria

# 5. Get status
curl http://localhost:3000/countries/status

# 6. View image (open in browser)
http://localhost:3000/countries/image

# 7. Delete country
curl -X DELETE http://localhost:3000/countries/TestCountry
```

---

## 📝 Notes

- The `estimated_gdp` is calculated as: `(population × random(1000-2000)) ÷ exchange_rate`
- The random multiplier is regenerated on each refresh
- Countries without currencies are stored with `null` values for currency fields
- The database tables are automatically created on first run
- Images are regenerated after each successful refresh

---

## 👤 Author

Gregory Temwa Odete
- GitHub: [@youneedgreg](https://github.com/youneedgreg)

---

## 🐛 Known Issues

None at the moment. Please report issues on GitHub.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!