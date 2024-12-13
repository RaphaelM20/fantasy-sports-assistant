// matchups.js

// Function to get the current week based on the whitelist data
async function getCurrentWeekFromWhitelist() {
  try {
    // Fetch the whitelist data from your backend route
    const whitelistResponse = await fetch('/api/whitelist');
    const whitelistData = await whitelistResponse.json();

    // Find the "Regular Season" section in the response
    const regularSeasonSection = whitelistData.sections.find(s => s.label === 'Regular Season');
    if (!regularSeasonSection || !regularSeasonSection.entries) {
      console.error('No regular season section found in whitelist data.');
      return null;
    }

    // Today's date
    const today = new Date();

    // Check which week matches today's date
    const currentWeekEntry = regularSeasonSection.entries.find(entry => {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      return today >= start && today <= end;
    });

    if (!currentWeekEntry) {
      console.warn('Season not started yet or no current week matches today\'s date.');
      return null;
    }

    // Extract the week number (value) from the matched week entry
    return parseInt(currentWeekEntry.value, 10);
  } catch (error) {
    console.error('Error fetching or parsing whitelist data:', error);
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
    matchupsList.innerHTML = ''; // Clear old data

    const response = await fetch(`/api/matchups?year=2024&week=${currentWeek}&type=2`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      data.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Event ID: ${item.eventid}`;
        li.style.padding = '8px';
        li.style.borderBottom = '1px solid #ccc';

        // Attach event listener (if loadEventDetails is used)
        li.addEventListener('click', () => {
          loadEventDetails(item.eventid);
        });

        matchupsList.appendChild(li);
      });

      matchupsLoading.style.display = 'none';
      matchupsList.style.display = 'block';
    } else {
      matchupsLoading.textContent = 'No matchups found for the current week.';
    }
  } catch (error) {
    console.error('Error loading matchups:', error);
    matchupsLoading.textContent = 'Failed to load matchups.';
  }
}

// Automatically load current week matchups when the page loads
