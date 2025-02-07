export interface WeatherData {
  weather: { main: string }[];
  main: { temp: number }
  name: string;
}
