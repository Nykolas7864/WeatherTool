import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weather.routes';
import prisma from './prisma';

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, process.env.FRONTEND_URL.replace(/\/$/, '')]
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow all if no FRONTEND_URL is set
    if (!process.env.FRONTEND_URL) return callback(null, true);
    
    // Check if origin matches
    if (allowedOrigins.includes(origin) || origin.includes('railway.app')) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

const apiDocsHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Tool API</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
      min-height: 100vh;
      color: #e2e8f0;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 3rem;
      background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
    }
    .frontend-link {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .frontend-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }
    .card h2 {
      color: #c4b5fd;
      margin-bottom: 16px;
      font-size: 1.3rem;
    }
    .endpoint {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border-left: 4px solid #6366f1;
    }
    .endpoint:last-child {
      margin-bottom: 0;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .method {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .method-get { background: #059669; color: white; }
    .method-post { background: #2563eb; color: white; }
    .method-delete { background: #dc2626; color: white; }
    .path {
      font-family: 'Monaco', 'Menlo', monospace;
      color: #fbbf24;
      font-size: 0.95rem;
    }
    .description {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }
    .params {
      font-size: 0.85rem;
      color: #64748b;
    }
    .params code {
      background: rgba(99, 102, 241, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
      color: #a5b4fc;
    }
    .try-link {
      display: inline-block;
      margin-top: 8px;
      padding: 6px 12px;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.8rem;
      transition: background 0.2s;
    }
    .try-link:hover {
      background: rgba(99, 102, 241, 0.4);
    }
    .example {
      margin-top: 12px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 12px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.8rem;
      overflow-x: auto;
      color: #a5b4fc;
    }
    footer {
      text-align: center;
      margin-top: 40px;
      color: #64748b;
      font-size: 0.9rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      color: #34d399;
      font-size: 0.9rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #34d399;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Weather Tool API</h1>
      <p class="subtitle">RESTful API for weather data, forecasts, and search history</p>
      <div style="margin-top: 20px;">
        <span class="status-badge">
          <span class="status-dot"></span>
          API Online
        </span>
      </div>
      <a href="{{FRONTEND_URL}}" class="frontend-link">Open Weather App</a>
    </header>

    <div class="card">
      <h2>Health & Status</h2>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-get">GET</span>
          <span class="path">/health</span>
        </div>
        <p class="description">Check if the API server is running</p>
        <a href="/health" target="_blank" class="try-link">Try it</a>
      </div>
    </div>

    <div class="card">
      <h2>Weather Data</h2>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-get">GET</span>
          <span class="path">/api/weather</span>
        </div>
        <p class="description">Get current weather for a city</p>
        <p class="params">
          Query params: <code>city</code> (required), <code>units</code> (metric | imperial, default: metric)
        </p>
        <a href="/api/weather?city=London&units=metric" target="_blank" class="try-link">Try it (London)</a>
        <div class="example">
GET /api/weather?city=London&units=metric

Response: { city, state, country, temperature, description, iconCode, unitLabel, localTime, humidity, windSpeed, feelsLike, vibeColor }
        </div>
      </div>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-get">GET</span>
          <span class="path">/api/weather/forecast</span>
        </div>
        <p class="description">Get 5-day weather forecast for a city</p>
        <p class="params">
          Query params: <code>city</code> (required), <code>units</code> (metric | imperial, default: metric)
        </p>
        <a href="/api/weather/forecast?city=Tokyo&units=metric" target="_blank" class="try-link">Try it (Tokyo)</a>
        <div class="example">
GET /api/weather/forecast?city=Tokyo&units=metric

Response: { city, country, forecast: [{ date, tempMin, tempMax, description, iconCode }] }
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Search History & Stats</h2>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-get">GET</span>
          <span class="path">/api/history</span>
        </div>
        <p class="description">Get all weather search history (most recent first)</p>
        <a href="/api/history" target="_blank" class="try-link">Try it</a>
      </div>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-get">GET</span>
          <span class="path">/api/stats/top-cities</span>
        </div>
        <p class="description">Get the most searched cities</p>
        <p class="params">
          Query params: <code>limit</code> (number, default: 5)
        </p>
        <a href="/api/stats/top-cities?limit=5" target="_blank" class="try-link">Try it</a>
      </div>
    </div>

    <div class="card">
      <h2>Favorites</h2>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-get">GET</span>
          <span class="path">/api/favorites</span>
        </div>
        <p class="description">Get all favorite cities</p>
        <a href="/api/favorites" target="_blank" class="try-link">Try it</a>
      </div>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-post">POST</span>
          <span class="path">/api/favorites</span>
        </div>
        <p class="description">Add a city to favorites</p>
        <p class="params">
          Request body: <code>{ "city": "Paris", "country": "FR" }</code>
        </p>
        <div class="example">
POST /api/favorites
Content-Type: application/json

{ "city": "Paris", "country": "FR" }
        </div>
      </div>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method method-delete">DELETE</span>
          <span class="path">/api/favorites/:id</span>
        </div>
        <p class="description">Remove a city from favorites</p>
        <p class="params">
          URL param: <code>id</code> (number) - The favorite's ID
        </p>
        <div class="example">
DELETE /api/favorites/1
        </div>
      </div>
    </div>

    <footer>
      <p>Weather Tool API v1.0 | Powered by OpenWeatherMap</p>
    </footer>
  </div>
</body>
</html>
`;

app.get('/', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const html = apiDocsHtml.replace('{{FRONTEND_URL}}', frontendUrl);
  res.send(html);
});

app.use('/api', weatherRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('Starting Weather Tool API...');
console.log('PORT:', PORT);
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
console.log('WEATHER_API_KEY set:', !!process.env.WEATHER_API_KEY);

async function main() {
  try {
    // Start server first so healthcheck passes
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Then try to connect to database
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      console.log('Server will continue running - database operations may fail');
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});

export default app;
