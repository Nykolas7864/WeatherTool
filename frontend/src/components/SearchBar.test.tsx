import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    onSearch: vi.fn(),
    units: 'metric' as const,
    onUnitsChange: vi.fn(),
    isLoading: false
  };

  it('renders search input and buttons', () => {
    render(<SearchBar {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter city name...')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('°F')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted with a city', async () => {
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    await userEvent.type(input, 'Dallas');
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    expect(onSearch).toHaveBeenCalledWith('Dallas');
  });

  it('does not call onSearch when input is empty', async () => {
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onUnitsChange when unit buttons are clicked', async () => {
    const onUnitsChange = vi.fn();
    render(<SearchBar {...defaultProps} onUnitsChange={onUnitsChange} />);
    
    const fahrenheitButton = screen.getByText('°F');
    await userEvent.click(fahrenheitButton);
    
    expect(onUnitsChange).toHaveBeenCalledWith('imperial');
  });

  it('disables input and button when loading', () => {
    render(<SearchBar {...defaultProps} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    expect(input).toBeDisabled();
  });

  it('highlights the active unit button', () => {
    const { rerender } = render(<SearchBar {...defaultProps} units="metric" />);
    
    const celsiusButton = screen.getByText('°C');
    expect(celsiusButton).toHaveClass('bg-blue-500');
    
    rerender(<SearchBar {...defaultProps} units="imperial" />);
    
    const fahrenheitButton = screen.getByText('°F');
    expect(fahrenheitButton).toHaveClass('bg-blue-500');
  });
});
