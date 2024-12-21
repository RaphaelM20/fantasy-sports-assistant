// Global map to store teams by their ID
const teamMap = new Map();

// Function to fetch and map team data
async function mapTeamData() {
    try {
        const response = await fetch('https://nfl-api-data.p.rapidapi.com/nfl-team-listing/v1/data', {
            method: 'GET',
            headers: {
                "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
                "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch team data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw team data received:", data);

        // Map team data
        data.forEach(entry => {
            const team = entry.team;
            teamMap.set(team.id, {
                name: team.displayName,
                abbreviation: team.abbreviation,
                location: team.location,
                logo: team.logos?.[0]?.href || '',
                color: team.color,
            });
        });

        console.log('Team data mapped successfully:', teamMap);
        populateTeamDropdowns();
    } catch (error) {
        console.error('Error mapping team data:', error);
    }
}

// Populate dropdown menus with team names
function populateTeamDropdowns() {
    const dropdowns = ['team-select-a', 'team-select-b'];

    dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '<option value="">Select a Team</option>'; // Reset dropdown
        teamMap.forEach((team, id) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = team.name;
            dropdown.appendChild(option);
        });
    });

    console.log("Dropdowns populated successfully.");
}

// Load selected team details
async function loadTeamDetails(dropdownId, detailsContainerId) {
    const teamId = document.getElementById(dropdownId).value;
    const detailsContainer = document.getElementById(detailsContainerId);

    if (!teamId) {
        detailsContainer.innerHTML = '<p>Please select a team.</p>';
        return;
    }

    const team = teamMap.get(teamId);
    if (!team) {
        detailsContainer.innerHTML = '<p>Team details not found.</p>';
        return;
    }

    detailsContainer.innerHTML = '<p>Loading team stats...</p>'; // Loading indicator

    try {
        const response = await fetch(`https://nfl-api-data.p.rapidapi.com/nfl-team-statistics?id=${teamId}&year=2024`, {
            method: 'GET',
            headers: {
                "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
                "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch team stats: ${response.status}`);
        }

        const statsData = await response.json();

        // Render team details with stats
        detailsContainer.style.backgroundColor = `#${team.color || 'ffffff'}`;
        detailsContainer.style.color = '#fff';
        detailsContainer.style.padding = '15px';
        detailsContainer.style.borderRadius = '8px';
        detailsContainer.innerHTML = `
            <h3>${team.name}</h3>
            <img src="${team.logo}" alt="${team.name} Logo" style="width: 100px;">
        `;
    } catch (error) {
        console.error('Error loading team stats:', error);
        detailsContainer.innerHTML = `<p>Error loading team stats. Please try again later.</p>`;
    }
}

// Ensure team data is loaded on page load
document.addEventListener('DOMContentLoaded', mapTeamData);
