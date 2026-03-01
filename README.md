# Weather Tool

A modern weather application built with Node.js/Express + TypeScript backend and React + TypeScript frontend. Search for weather by city, view 5-day forecasts, track search history, and save favorite cities.

## Features

- **Current Weather**: Real-time weather data including temperature, humidity, wind speed, and "feels like" temperature
- **5-Day Forecast**: Extended weather forecast with daily high/low temperatures
- **Temperature Units**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Search History**: Track your recent weather searches stored in PostgreSQL
- **Popular Cities**: See the most searched cities
- **Favorite Cities**: Save and quickly access your favorite locations
- **Geolocation**: Use your current location to get local weather
- **Vibe Colors**: Dynamic background gradients based on temperature (hot/cold/moderate)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite |
| Backend | Express.js + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| API | OpenWeatherMap |
| Containers | Docker + Docker Compose |

## Prerequisites

- Node.js 20+ 
- npm or yarn
- Docker and Docker Compose (for containerized setup)
- OpenWeatherMap API key (free tier available at https://openweathermap.org/api)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-tool
   ```

2. Create a `.env` file in the root directory:
   ```env
   WEATHER_API_KEY=your_openweathermap_api_key_here
   ```

3. Start all services:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Option 2: Local Development

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   PORT=3001
   WEATHER_API_KEY=your_openweathermap_api_key_here
   DATABASE_URL=postgresql://postgres:password@localhost:5432/weatherdb
   ```

4. Start PostgreSQL (using Docker):
   ```bash
   docker run -d --name weather-db \
     -e POSTGRES_DB=weatherdb \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     postgres:16-alpine
   ```

5. Run database migrations:
   ```bash
   npm run db:push
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?city={city}&units={units}` | Get current weather for a city |
| GET | `/api/weather/forecast?city={city}&units={units}` | Get 5-day forecast |
| GET | `/api/history` | Get search history |
| GET | `/api/stats/top-cities` | Get most searched cities |
| GET | `/api/favorites` | Get favorite cities |
| POST | `/api/favorites` | Add a favorite city |
| DELETE | `/api/favorites/:id` | Remove a favorite city |
| GET | `/health` | Health check endpoint |

## Project Structure

```
weather-tool/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── prisma.ts        # Prisma client
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   ├── test/            # Test setup
│   │   └── App.tsx          # Main app component
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `WEATHER_API_KEY` | OpenWeatherMap API key | (required) |
| `DATABASE_URL` | PostgreSQL connection string | (required) |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

### Frontend (Optional)
| Variable | Description |
|----------|-------------|
| `VITE_WEATHER_API_KEY` | API key for geolocation reverse geocoding |

## Deployment

### Railway / Render / Fly.io

1. Create a PostgreSQL database instance
2. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key
   - `PORT`: Usually auto-assigned by the platform

3. Deploy backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

4. Deploy frontend (static hosting):
   ```bash
   cd frontend
   npm run build
   # Upload dist/ folder to your static host
   ```

## Migration from Java/Spring Boot

This project is a refactor of the original Java/Spring Boot WeatherTool application. Key changes:

| Original (Java) | New (Node.js) |
|-----------------|---------------|
| Spring Boot | Express.js |
| Thymeleaf templates | React SPA |
| JPA/Hibernate | Prisma ORM |
| Maven | npm |
| Java records | TypeScript interfaces |

The core functionality remains the same:
- OpenWeatherMap API integration
- PostgreSQL for search history
- Temperature unit conversion
- "Vibe color" gradients based on temperature

## License

ISC
