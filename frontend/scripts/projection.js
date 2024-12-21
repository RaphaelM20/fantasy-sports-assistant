// Global arrays for filtered players
const quarterbacks = [];
const runningBacks = [];
const wideReceivers = [];
const tightEnds = [];
const placeKickers = [];


// Fetches the mapping of team names to IDs
async function fetchTeamMap() {
    const url = "https://nfl-api-data.p.rapidapi.com/nfl-team-listing/v1/data";
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
            "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch team map: ${response.status}`);
        const data = await response.json();

        const teamMap = {};
        data.forEach(team => {
            teamMap[team.team.displayName.toLowerCase()] = team.team.id;
        });
        return teamMap;
    } catch (error) {
        console.error("Error fetching team map:", error);
        return {};
    }
}

// Fetch players filtered by relevant positions
async function fetchFilteredPlayers(teamId) {
    const url = `https://nfl-api-data.p.rapidapi.com/nfl-player-listing/v1/data?id=${teamId}`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
            "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch players for team ID ${teamId}: ${response.status}`);
        const data = await response.json();

        data.athletes.forEach(group => {
            if (group.items && Array.isArray(group.items)) {
                group.items.forEach(player => {
                    const position = player.position?.displayName;

                    // Create a streamlined player object
                    const playerData = {
                        id: player.id,
                        name: player.fullName,
                        position: position,
                        teamName: player.team?.displayName || "Unknown",
                        headshot: player.headshot?.href || "https://via.placeholder.com/50", // Fallback to placeholder image
                    };

                    // Add the player to the appropriate array
                    if (position === "Quarterback") {
                        quarterbacks.push(playerData);
                    } else if (position === "Running Back") {
                        runningBacks.push(playerData);
                    } else if (position === "Wide Receiver") {
                        wideReceivers.push(playerData);
                    } else if (position === "Tight End") {
                        tightEnds.push(playerData);
                    } else if (position === "Place Kicker") {
                        placeKickers.push(playerData); // Add to place kickers
                    }
                });
            }
        });

        console.log(`Players fetched for team ID ${teamId}`);
    } catch (error) {
        console.error(`Error fetching filtered players for team ID ${teamId}:`, error);
    }
}

// Fetch players for all teams
async function fetchAllTeamsAndPlayers() {
    const teamMap = await fetchTeamMap();

    for (const [teamName, teamId] of Object.entries(teamMap)) {
        await fetchFilteredPlayers(teamId);
    }

    console.log("All players fetched:", {
        quarterbacks,
        runningBacks,
        wideReceivers,
        tightEnds,
    });
}

// Populate dropdown menu dynamically when clicking the input field
function populateDropdownOnClick(position, inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener("focus", () => {
        dropdown.innerHTML = ""; // Clear previous options

        // Get the correct array of players based on the position
        const players = (() => {
            if (position === "Quarterback") return quarterbacks;
            if (position === "Running Back") return runningBacks;
            if (position === "Wide Receiver") return wideReceivers;
            if (position === "Tight End") return tightEnds;
            if (position === "Place Kicker") return placeKickers;
            if (position === "Flex") return [...runningBacks, ...wideReceivers, ...tightEnds]; // Combine arrays for Flex
            return [];
        })();

        players.forEach(player => {
            const option = document.createElement("li");
            option.style.display = "flex";
            option.style.alignItems = "center";
            option.style.padding = "10px"; // Add padding for better spacing

            // Add player's headshot
            const img = document.createElement("img");
            img.src = player.headshot;
            img.alt = `${player.name} Headshot`;
            img.style.width = "40px"; // Adjust headshot size for dropdown
            img.style.height = "40px";
            img.style.marginRight = "10px";
            img.style.borderRadius = "50%"; // Optional: circular appearance
            option.appendChild(img);

            // Add player name
            const text = document.createElement("span");
            text.textContent = player.name;
            option.appendChild(text);

            // Handle dropdown selection
            option.addEventListener("click", () => {
                input.value = player.name; // Set input value to player's name
                dropdown.style.display = "none"; // Hide dropdown
            });

            dropdown.appendChild(option);
        });

        dropdown.style.display = "block"; // Show dropdown
    });

    input.addEventListener("input", () => {
        const searchTerm = input.value.toLowerCase();
        Array.from(dropdown.children).forEach(option => {
            option.style.display = option.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
        });
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            dropdown.style.display = "none"; // Hide dropdown on blur
        }, 200);
    });
}

// Initialize dropdowns and setup event listeners
async function initialize() {
    await fetchAllTeamsAndPlayers(); // Fetch all players when the page loads

    // Setup dropdowns for each position in "Your Lineup"
    populateDropdownOnClick("Quarterback", "qb", "qb-options");
    populateDropdownOnClick("Wide Receiver", "wr1", "wr1-options");
    populateDropdownOnClick("Wide Receiver", "wr2", "wr2-options");
    populateDropdownOnClick("Running Back", "rb1", "rb1-options");
    populateDropdownOnClick("Running Back", "rb2", "rb2-options");
    populateDropdownOnClick("Tight End", "te", "te-options");
    populateDropdownOnClick("Place Kicker", "k", "k-options");
    populateDropdownOnClick("Flex", "flex", "flex-options");
    populateDropdownOnClick("Defense", "defense", "defense-options");

    // Setup dropdowns for each position in "Opponent's Lineup"
    populateDropdownOnClick("Quarterback", "qb-opponent", "qb-options-opponent");
    populateDropdownOnClick("Wide Receiver", "wr1-opponent", "wr1-options-opponent");
    populateDropdownOnClick("Wide Receiver", "wr2-opponent", "wr2-options-opponent");
    populateDropdownOnClick("Running Back", "rb1-opponent", "rb1-options-opponent");
    populateDropdownOnClick("Running Back", "rb2-opponent", "rb2-options-opponent");
    populateDropdownOnClick("Tight End", "te-opponent", "te-options-opponent");
    populateDropdownOnClick("Place Kicker", "k-opponent", "k-options-opponent");
    populateDropdownOnClick("Flex", "flex-opponent", "flex-options-opponent");
    populateDropdownOnClick("Defense", "defense-opponent", "defense-options-opponent");

    console.log("Initialization complete!");
}


// Start the setup when the page loads
initialize();
