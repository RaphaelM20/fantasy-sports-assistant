async function loadEventDetails(eventId) {
  console.log("[EventDetails.js] Loading event details for ID:", eventId);

  const eventDetailsContainer = document.getElementById('event-details');
  eventDetailsContainer.style.display = 'block';
  eventDetailsContainer.innerHTML = 'Loading event details...';

  try {
    const response = await fetch(`https://nfl-api-data.p.rapidapi.com/nfl-single-events?id=${eventId}`, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
        "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch event details: ${response.status} ${response.statusText}`);

    const eventData = await response.json();
    console.log("[EventDetails.js] Event Data:", eventData);

    const competition = eventData.competitions?.[0];
    const homeTeam = competition?.competitors.find(c => c.homeAway === 'home')?.team;
    const awayTeam = competition?.competitors.find(c => c.homeAway === 'away')?.team;
    const venue = competition?.venue;
    const weather = competition?.weather;

    // Simplified temperature and precipitation handling
    const currentTemp = weather?.temperature || "Not Available";
    const precipitation = weather?.precipitation != null ? `${weather.precipitation}%` : "0%";

    eventDetailsContainer.innerHTML = `
      <h3>${eventData.name || "Event Details"}</h3>
      <p><strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}</p>
      <div style="display: flex; justify-content: space-around; align-items: center; margin: 10px 0;">
        <div style="text-align: center;">
          <img src="${awayTeam?.logos || ''}" alt="${awayTeam?.displayName || 'Away Team Logo'}" style="width: 60px;">
          <p>${awayTeam?.displayName || "Unknown Away Team"}</p>
        </div>
        <p style="margin: 0 10px;">VS</p>
        <div style="text-align: center;">
          <img src="${homeTeam?.logos || ''}" alt="${homeTeam?.displayName || 'Home Team Logo'}" style="width: 60px;">
          <p>${homeTeam?.displayName || "Unknown Home Team"}</p>
        </div>
      </div>
      <p><strong>Venue:</strong> ${venue?.fullName || "Unknown"}, ${venue?.address?.city || ""}, ${venue?.address?.state || ""}</p>
      <h4>Weather</h4>
      <p>${weather?.displayValue || "Not Available"}</p>
      <p><strong>Temperature:</strong> ${currentTemp}°F</p>
      <p><strong>Precipitation:</strong> ${precipitation}</p>
    `;
  } catch (error) {
    console.error("[EventDetails.js] Error loading event details:", error.message);
    eventDetailsContainer.innerHTML = `<p>Error: ${error.message}. Please try again later.</p>`;
  }
}
