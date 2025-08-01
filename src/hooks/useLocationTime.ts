import { useState, useEffect } from 'react';

interface LocationTimeState {
  isDayTime: boolean;
  isLoading: boolean;
  error: string | null;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  } | null;
}

export const useLocationTime = () => {
  const [state, setState] = useState<LocationTimeState>({
    isDayTime: false,
    isLoading: true,
    error: null,
    location: null,
  });

  useEffect(() => {
    const getUserLocationAndTime = async () => {
      try {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutes cache
            }
          );
        });

        const { latitude, longitude } = position.coords;

        // Get timezone information using a free API
        const timezoneResponse = await fetch(
          `https://api.ipgeolocation.io/timezone?apiKey=free&lat=${latitude}&long=${longitude}`
        );

        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        if (timezoneResponse.ok) {
          const timezoneData = await timezoneResponse.json();
          timezone = timezoneData.timezone || timezone;
        }

        // Calculate if it's day or night based on local time
        const now = new Date();
        const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
        const hour = localTime.getHours();
        
        // Consider it day time between 6 AM and 6 PM
        const isDayTime = hour >= 6 && hour < 18;

        setState({
          isDayTime,
          isLoading: false,
          error: null,
          location: {
            latitude,
            longitude,
            timezone,
          },
        });
      } catch (error: any) {
        console.warn('Could not get location/time:', error.message);
        
        // Fallback to local system time
        const now = new Date();
        const hour = now.getHours();
        const isDayTime = hour >= 6 && hour < 18;

        setState({
          isDayTime,
          isLoading: false,
          error: 'Using local time (location access denied)',
          location: null,
        });
      }
    };

    getUserLocationAndTime();

    // Update every minute to keep time accurate
    const interval = setInterval(() => {
      if (state.location) {
        const now = new Date();
        const localTime = new Date(now.toLocaleString("en-US", { timeZone: state.location.timezone }));
        const hour = localTime.getHours();
        const isDayTime = hour >= 6 && hour < 18;

        setState(prev => ({
          ...prev,
          isDayTime,
        }));
      } else {
        // Fallback update
        const now = new Date();
        const hour = now.getHours();
        const isDayTime = hour >= 6 && hour < 18;

        setState(prev => ({
          ...prev,
          isDayTime,
        }));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return state;
};