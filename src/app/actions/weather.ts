"use server";

export async function getLiveWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "API Key not configured",
      data: {
        temp: 14.5,
        windSpeed: 4.2,
        windDir: "NW",
        visibility: 10000,
        condition: "Clear"
      }
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) throw new Error("Weather fetch failed");
    
    const data = await response.json();
    
    return {
      success: true,
      data: {
        temp: data.main.temp,
        windSpeed: data.wind.speed,
        windDir: getWindDirection(data.wind.deg),
        visibility: data.visibility,
        condition: data.weather[0].main
      }
    };
  } catch (error) {
    console.error("Weather Service Error:", error);
    return { success: false, error: "Service unavailable" };
  }
}

function getWindDirection(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}
