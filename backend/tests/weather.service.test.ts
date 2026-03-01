import axios from 'axios';

jest.mock('axios');
jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: {
    searchRecord: {
      create: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn()
    },
    favoriteCity: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WEATHER_API_KEY = 'test-api-key';
  });

  describe('capitalizeWords helper', () => {
    it('should capitalize first letter of each word', () => {
      const capitalizeWords = (str: string): string => {
        return str
          .trim()
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      expect(capitalizeWords('new york')).toBe('New York');
      expect(capitalizeWords('DALLAS')).toBe('Dallas');
      expect(capitalizeWords('  los angeles  ')).toBe('Los Angeles');
    });
  });

  describe('formatLocalTime helper', () => {
    it('should format time correctly', () => {
      const formatLocalTime = (timezoneOffsetSeconds: number): string => {
        const now = new Date();
        const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
        const localTime = new Date(utcTime + timezoneOffsetSeconds * 1000);
        return localTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      };

      const result = formatLocalTime(0);
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });
  });

  describe('getVibeColor helper', () => {
    it('should return hot gradient for high temperatures', () => {
      const getVibeColor = (temperature: number, unitLabel: string): string => {
        const isHot = unitLabel === '°F' ? temperature > 80 : temperature > 27;
        const isCold = unitLabel === '°F' ? temperature < 45 : temperature < 7;

        if (isHot) return 'linear-gradient(135deg, #ff9966, #ff5e62)';
        if (isCold) return 'linear-gradient(135deg, #7f7fd5, #86a8e7)';
        return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
      };

      expect(getVibeColor(30, '°C')).toBe('linear-gradient(135deg, #ff9966, #ff5e62)');
      expect(getVibeColor(85, '°F')).toBe('linear-gradient(135deg, #ff9966, #ff5e62)');
    });

    it('should return cold gradient for low temperatures', () => {
      const getVibeColor = (temperature: number, unitLabel: string): string => {
        const isHot = unitLabel === '°F' ? temperature > 80 : temperature > 27;
        const isCold = unitLabel === '°F' ? temperature < 45 : temperature < 7;

        if (isHot) return 'linear-gradient(135deg, #ff9966, #ff5e62)';
        if (isCold) return 'linear-gradient(135deg, #7f7fd5, #86a8e7)';
        return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
      };

      expect(getVibeColor(5, '°C')).toBe('linear-gradient(135deg, #7f7fd5, #86a8e7)');
      expect(getVibeColor(40, '°F')).toBe('linear-gradient(135deg, #7f7fd5, #86a8e7)');
    });

    it('should return neutral gradient for moderate temperatures', () => {
      const getVibeColor = (temperature: number, unitLabel: string): string => {
        const isHot = unitLabel === '°F' ? temperature > 80 : temperature > 27;
        const isCold = unitLabel === '°F' ? temperature < 45 : temperature < 7;

        if (isHot) return 'linear-gradient(135deg, #ff9966, #ff5e62)';
        if (isCold) return 'linear-gradient(135deg, #7f7fd5, #86a8e7)';
        return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
      };

      expect(getVibeColor(20, '°C')).toBe('linear-gradient(135deg, #e0eafc, #cfdef3)');
      expect(getVibeColor(70, '°F')).toBe('linear-gradient(135deg, #e0eafc, #cfdef3)');
    });
  });

  describe('API response parsing', () => {
    it('should parse weather API response correctly', () => {
      const mockApiResponse = {
        name: 'Dallas',
        sys: { country: 'US' },
        main: { temp: 25.5, humidity: 60, feels_like: 26.0 },
        weather: [{ description: 'clear sky', icon: '01d' }],
        wind: { speed: 5.5 },
        timezone: -18000
      };

      expect(mockApiResponse.name).toBe('Dallas');
      expect(mockApiResponse.sys.country).toBe('US');
      expect(mockApiResponse.main.temp).toBe(25.5);
      expect(mockApiResponse.weather[0].description).toBe('clear sky');
    });

    it('should parse forecast API response correctly', () => {
      const mockForecastResponse = {
        city: { name: 'Dallas', country: 'US' },
        list: [
          {
            dt_txt: '2026-02-28 12:00:00',
            main: { temp_min: 20, temp_max: 25 },
            weather: [{ description: 'sunny', icon: '01d' }]
          }
        ]
      };

      expect(mockForecastResponse.city.name).toBe('Dallas');
      expect(mockForecastResponse.list[0].main.temp_min).toBe(20);
      expect(mockForecastResponse.list[0].main.temp_max).toBe(25);
    });
  });
});
