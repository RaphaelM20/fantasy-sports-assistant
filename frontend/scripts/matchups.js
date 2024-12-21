// Function to get the current week from the whitelist
async function getCurrentWeekFromWhitelist() {
  try {
    const response = await fetch('https://nfl-api-data.p.rapidapi.com/nfl-whitelist', {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
        "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
      },
    });

    const whitelistData = await response.json();

    const regularSeasonSection = whitelistData.sections.find(s => s.label === 'Regular Season');
    if (!regularSeasonSection || !regularSeasonSection.entries) {
      console.error('No regular season section found in whitelist data.');
      return null;
    }

    const today = new Date();
    const currentWeekEntry = regularSeasonSection.entries.find(entry => {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      return today >= start && today <= end;
    });

    if (!currentWeekEntry) {
      console.warn('Season not started yet or no week matches today\'s date.');
      return null;
    }

    return parseInt(currentWeekEntry.value, 10);
  } catch (error) {
    console.error('Error fetching or parsing whitelist data:', error);
    return null;
  }
}

// Function to fetch event details
async function fetchEventDetails(eventId) {
  try {
    const response = await fetch(`https://nfl-api-data.p.rapidapi.com/nfl-single-events?id=${eventId}`, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
        "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

// Function to load matchups for the current week
async function loadCurrentWeekMatchups() {
  const matchupsLoading = document.getElementById('matchups-loading');
  const matchupsList = document.getElementById('matchups-list');

  matchupsLoading.style.display = 'block';
  matchupsList.style.display = 'none';

  const currentWeek = await getCurrentWeekFromWhitelist();
  if (!currentWeek) {
    matchupsLoading.textContent = 'No current week found or season not started.';
    return;
  }

  try {
    const response = await fetch(`https://nfl-api-data.p.rapidapi.com/nfl-weeks-events?year=2024&week=${currentWeek}&type=2`, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
        "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch matchups: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      matchupsList.innerHTML = ''; // Clear old data

      for (const item of data.items) {
        const eventDetails = await fetchEventDetails(item.eventid);

        if (eventDetails) {
          const competition = eventDetails.competitions?.[0];
          const homeTeam = competition?.competitors.find(c => c.homeAway === 'home')?.team;
          const awayTeam = competition?.competitors.find(c => c.homeAway === 'away')?.team;

          const li = document.createElement('li');
          li.textContent = `${awayTeam?.displayName || 'Unknown Away Team'} @ ${homeTeam?.displayName || 'Unknown Home Team'}`;
          li.style.cursor = 'pointer';
          li.style.padding = '8px';
          li.style.borderBottom = '1px solid #ccc';

          // Attach event listener for event details
          li.addEventListener('click', () => {
            loadEventDetails(eventDetails.id);
          });

          matchupsList.appendChild(li);
        }
      }

      matchupsLoading.style.display = 'none';
      matchupsList.style.display = 'block';
    } else {
      matchupsLoading.textContent = 'No matchups found for this week.';
    }
  } catch (error) {
    console.error('Error loading matchups:', error);
    matchupsLoading.textContent = 'Failed to load matchups. Check your connection.';
  }
}

// Automatically load current week matchups when the page loads
document.addEventListener('DOMContentLoaded', loadCurrentWeekMatchups);
