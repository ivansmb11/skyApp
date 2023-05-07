import { ref } from "vue";
import { Plugins } from '@capacitor/core';

import { key } from '@/weather/weather-api-key';
import { OneWeather } from './one-weather.model';

const weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly';

const weather = ref<OneWeather>();

export function useWeather() {
  return {
    weather,
    fetchWeather,
    getWeatherImageUrl,
    formatTemperature,
    formatWindSpeed
  }
}

async function fetchWeather(): Promise<void> {
  const { coords } = await Plugins.Geolocation.getCurrentPosition();
  const response = await fetch(`${weatherUrl}&lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&units=imperial`);
  weather.value = await response.json();
}

function getWeatherImageUrl(iconName: string, size: '2x' | '4x') {
  return `http://openweathermap.org/img/wn/${iconName}@${size ? size : '1x'}.png`;
}

function formatTemperature(value: number, format: 'F' | 'C') {
  const celcius = (value - 32) * 5 / 9;
  return `${Math.round(celcius)}° ${format}`;
}

function formatWindSpeed(value: number, format: 'mph' | 'km/h') {
  if (format === 'km/h') {
    return `${Math.round(value * 1.609)} ${format}`;
  } else {
    return `${Math.round(value)} ${format}`;
  }
}
