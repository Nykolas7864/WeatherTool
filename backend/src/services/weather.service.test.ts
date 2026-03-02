import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org';
const API_KEY = process.env.WEATHER_API_KEY;

// Copy of the buildGeoQuery function for testing
const US_STATE_MAP: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};
const US_STATE_NAME_TO_ABBREV: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATE_MAP).map(([abbrev, name]) => [name.toUpperCase(), abbrev])
);

function capitalizeWords(str: string): string {
  return str.trim().toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function buildGeoQuery(input: string): string {
  const parts = input.split(',').map(p => p.trim());
  if (parts.length === 1) return capitalizeWords(parts[0]);
  if (parts.length === 2) {
    const city = capitalizeWords(parts[0]);
    const secondPart = parts[1].trim().toUpperCase();
    if (US_STATE_MAP[secondPart]) return `${city},${secondPart},US`;
    const stateAbbrev = US_STATE_NAME_TO_ABBREV[secondPart];
    if (stateAbbrev) return `${city},${stateAbbrev},US`;
    if (secondPart.length === 2) return `${city},${secondPart}`;
    return `${city},${capitalizeWords(parts[1])}`;
  }
  if (parts.length >= 3) {
    const city = capitalizeWords(parts[0]);
    const state = parts[1].trim();
    const country = parts[2].trim().toUpperCase();
    const stateUpper = state.toUpperCase();
    const stateAbbrev = US_STATE_MAP[stateUpper] ? stateUpper : US_STATE_NAME_TO_ABBREV[stateUpper] || state;
    return `${city},${stateAbbrev},${country}`;
  }
  return capitalizeWords(input);
}

function testBuildGeoQuery() {
  console.log('='.repeat(60));
  console.log('TEST: buildGeoQuery function');
  console.log('='.repeat(60));
  
  const testCases = [
    { input: 'Allen', expected: 'Allen' },
    { input: 'Allen, TX', expected: 'Allen,TX,US' },
    { input: 'Allen, tx', expected: 'Allen,TX,US' },
    { input: 'Allen, Texas', expected: 'Allen,TX,US' },
    { input: 'Allen, IN', expected: 'Allen,IN,US' },
    { input: 'Allen, Indiana', expected: 'Allen,IN,US' },
    { input: 'Paris', expected: 'Paris' },
    { input: 'Paris, FR', expected: 'Paris,FR' },
    { input: 'Paris, TX', expected: 'Paris,TX,US' },
    { input: 'Paris, Texas', expected: 'Paris,TX,US' },
    { input: 'New York, NY', expected: 'New York,NY,US' },
    { input: 'Los Angeles, California', expected: 'Los Angeles,CA,US' },
    { input: 'Dallas, TX, US', expected: 'Dallas,TX,US' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const { input, expected } of testCases) {
    const result = buildGeoQuery(input);
    const status = result === expected ? '✓' : '✗';
    if (result === expected) passed++; else failed++;
    console.log(`${status} "${input}" => "${result}" (expected: "${expected}")`);
  }
  
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

if (!API_KEY) {
  console.error('WEATHER_API_KEY not set in environment');
  process.exit(1);
}

interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface WeatherResult {
  name: string;
  coord: { lat: number; lon: number };
  main: { temp: number };
  sys: { country: string };
}

async function testGeocodingAPI(query: string): Promise<GeoResult[]> {
  const url = `${OPENWEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  console.log(`\n[GEOCODING] Query: "${query}"`);
  console.log(`[GEOCODING] URL: ${url.replace(API_KEY!, '[REDACTED]')}`);
  
  try {
    const response = await axios.get(url);
    console.log(`[GEOCODING] Results (${response.data.length}):`);
    response.data.forEach((r: GeoResult, i: number) => {
      console.log(`  ${i + 1}. ${r.name}, ${r.state || 'N/A'}, ${r.country} (lat: ${r.lat}, lon: ${r.lon})`);
    });
    return response.data;
  } catch (error: any) {
    console.error(`[GEOCODING] Error: ${error.message}`);
    return [];
  }
}

async function testWeatherByCoords(lat: number, lon: number): Promise<WeatherResult | null> {
  const url = `${OPENWEATHER_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
  console.log(`[WEATHER] Coords: lat=${lat}, lon=${lon}`);
  
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(`[WEATHER] Result: ${data.name}, ${data.sys.country} - ${data.main.temp}°F`);
    return data;
  } catch (error: any) {
    console.error(`[WEATHER] Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  // First test the query builder
  testBuildGeoQuery();
  
  console.log('\n' + '='.repeat(60));
  console.log('WEATHER API GEOCODING TESTS');
  console.log('='.repeat(60));

  // Test 1: Allen with different state formats
  console.log('\n' + '='.repeat(60));
  console.log('TEST 1: Allen city disambiguation');
  console.log('='.repeat(60));
  
  await testGeocodingAPI('Allen');
  await testGeocodingAPI('Allen, TX');
  await testGeocodingAPI('Allen, Texas');
  await testGeocodingAPI('Allen, IN');
  await testGeocodingAPI('Allen, Indiana');
  await testGeocodingAPI('Allen, TX, US');
  await testGeocodingAPI('Allen, IN, US');
  await testGeocodingAPI('Allen, Indiana, US');

  // Test 2: Paris disambiguation
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Paris city disambiguation');
  console.log('='.repeat(60));
  
  await testGeocodingAPI('Paris');
  await testGeocodingAPI('Paris, FR');
  await testGeocodingAPI('Paris, France');
  await testGeocodingAPI('Paris, TX');
  await testGeocodingAPI('Paris, Texas');
  await testGeocodingAPI('Paris, TX, US');

  // Test 3: Verify weather data for specific coordinates
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Weather by coordinates');
  console.log('='.repeat(60));
  
  // Allen, Texas coordinates (from earlier logs)
  console.log('\nAllen, Texas (expected ~67°F):');
  await testWeatherByCoords(33.1031744, -96.6705503);
  
  // Allen, Indiana coordinates (need to find)
  const allenINResults = await testGeocodingAPI('Allen, Indiana, US');
  if (allenINResults.length > 0) {
    const allenIN = allenINResults.find(r => r.state === 'Indiana') || allenINResults[0];
    console.log('\nAllen, Indiana (expected ~30°F):');
    await testWeatherByCoords(allenIN.lat, allenIN.lon);
  }
  
  // Paris, France
  console.log('\nParis, France:');
  await testWeatherByCoords(48.8566, 2.3522);
  
  // Paris, Texas
  const parisTXResults = await testGeocodingAPI('Paris, Texas, US');
  if (parisTXResults.length > 0) {
    console.log('\nParis, Texas:');
    await testWeatherByCoords(parisTXResults[0].lat, parisTXResults[0].lon);
  }

  console.log('\n' + '='.repeat(60));
  console.log('TESTS COMPLETE');
  console.log('='.repeat(60));
}

runTests().catch(console.error);
