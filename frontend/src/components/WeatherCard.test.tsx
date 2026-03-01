import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherCard } from './WeatherCard';
import type { WeatherData, FavoriteCity } from '../types/weather';

describe('WeatherCard', () => {
  const mockWeather: WeatherData = {
    city: 'Dallas',
    state: 'Texas',
    country: 'US',
    temperature: 25,
    description: 'clear sky',
    iconCode: '01d',
    unitLabel: '°C',
    localTime: '3:00 PM',
    humidity: 60,
    windSpeed: 5.5,
    feelsLike: 26,
    vibeColor: 'linear-gradient(135deg, #e0eafc, #cfdef3)'
  };

  const defaultProps = {
    weather: mockWeather,
    favorites: [] as FavoriteCity[],
    onAddFavorite: vi.fn(),
    onRemoveFavorite: vi.fn()
  };

  it('renders weather information correctly', () => {
    render(<WeatherCard {...defaultProps} />);
    
    expect(screen.getByText('Dallas, Texas, US')).toBeInTheDocument();
    expect(screen.getByText('3:00 PM')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('displays weather details', () => {
    render(<WeatherCard {...defaultProps} />);
    
    expect(screen.getByText('26°C')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('5.5 m/s')).toBeInTheDocument();
  });

  it('renders without state when not provided', () => {
    const weatherWithoutState = { ...mockWeather, state: null };
    render(<WeatherCard {...defaultProps} weather={weatherWithoutState} />);
    
    expect(screen.getByText('Dallas, US')).toBeInTheDocument();
  });

  it('calls onAddFavorite when heart button is clicked and not favorite', async () => {
    const onAddFavorite = vi.fn();
    render(<WeatherCard {...defaultProps} onAddFavorite={onAddFavorite} />);
    
    const heartButton = screen.getByTitle('Add to favorites');
    await userEvent.click(heartButton);
    
    expect(onAddFavorite).toHaveBeenCalledWith('Dallas', 'US');
  });

  it('calls onRemoveFavorite when heart button is clicked and is favorite', async () => {
    const onRemoveFavorite = vi.fn();
    const favorites: FavoriteCity[] = [
      { id: 1, city: 'Dallas', country: 'US', addedAt: '2026-02-28' }
    ];
    
    render(
      <WeatherCard
        {...defaultProps}
        favorites={favorites}
        onRemoveFavorite={onRemoveFavorite}
      />
    );
    
    const heartButton = screen.getByTitle('Remove from favorites');
    await userEvent.click(heartButton);
    
    expect(onRemoveFavorite).toHaveBeenCalledWith(1);
  });

  it('displays wind speed in mph for imperial units', () => {
    const imperialWeather = { ...mockWeather, unitLabel: '°F' };
    render(<WeatherCard {...defaultProps} weather={imperialWeather} />);
    
    expect(screen.getByText('5.5 mph')).toBeInTheDocument();
  });
});
