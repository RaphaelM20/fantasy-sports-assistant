
// Function to fetch team stats from the API
async function fetchTeamStats(teamId, year) {
    const url = `https://nfl-api-data.p.rapidapi.com/nfl-team-statistics?id=${teamId}&year=${year}`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89",
            "X-RapidAPI-Host": "nfl-api-data.p.rapidapi.com",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch stats: ${response.status}`);
        const data = await response.json();

        console.log("General Stats:", data.statistics.splits.categories.find(category => category.name === "general"));
        
        // Locate categories safely
        const passingStats = data.statistics.splits.categories.find(category => category.name === "passing") || { stats: [] };
        const rushingStats = data.statistics.splits.categories.find(category => category.name === "rushing") || { stats: [] };
        const scoringStats = data.statistics.splits.categories.find(category => category.name === "scoring") || { stats: [] };
        const defenseStats = data.statistics.splits.categories.find(category => category.name === "defensive") || { stats: [] };
        const interceptionStats = data.statistics.splits.categories.find(category => category.name === "defensiveInterceptions") || { stats: [] };
        const kickingStats = data.statistics.splits.categories.find(category => category.name === "kicking");
        const puntingStats = data.statistics.splits.categories.find(category => category.name === "punting");
        const generalStats = data.statistics.splits.categories.find(category => category.name === "general") || { stats: [] };
        const miscStats = data.statistics.splits.categories.find(category => category.name === "miscellaneous") || { stats: [] };

        // Extract required stats
        return {
            // Offensive stats
            totalYards: passingStats.stats.find(stat => stat.name === "netTotalYards")?.displayValue || "N/A",
            yardsPerGame: passingStats.stats.find(stat => stat.name === "netYardsPerGame")?.displayValue || "N/A",
            totalPassingYards: passingStats.stats.find(stat => stat.name === "netPassingYards")?.displayValue || "N/A",
            passingYardsPerGame: passingStats.stats.find(stat => stat.name === "netPassingYardsPerGame")?.displayValue || "N/A",
            totalRushingYards: rushingStats.stats.find(stat => stat.name === "netTotalYards")?.displayValue || "N/A",
            rushingYardsPerGame: rushingStats.stats.find(stat => stat.name === "netYardsPerGame")?.displayValue || "N/A",
            totalPoints: scoringStats.stats.find(stat => stat.name === "totalPoints")?.displayValue || "N/A",
            pointsPerGame: scoringStats.stats.find(stat => stat.name === "totalPointsPerGame")?.displayValue || "N/A",

            // Defensive stats
            totalTackles: defenseStats.stats.find(stat => stat.name === "totalTackles")?.displayValue || "N/A",
            sacks: defenseStats.stats.find(stat => stat.name === "sacks")?.displayValue || "N/A",
            interceptions: interceptionStats.stats.find(stat => stat.name === "interceptions")?.displayValue || "N/A",
            defensiveTouchdowns: defenseStats.stats.find(stat => stat.name === "defensiveTouchdowns")?.displayValue || "N/A",
            passesDefended: defenseStats.stats.find(stat => stat.name === "passesDefended")?.displayValue || "N/A",
            interceptionYards: interceptionStats.stats.find(stat => stat.name === "interceptionYards")?.displayValue || "N/A",
            soloTackles: defenseStats.stats.find(stat => stat.name === "soloTackles")?.displayValue || "N/A",
            tacklesForLoss: defenseStats.stats.find(stat => stat.name === "tacklesForLoss")?.displayValue || "N/A",
            yardsAllowed: defenseStats.stats.find(stat => stat.name === "yardsAllowed")?.displayValue || "N/A",
            pointsAllowed: defenseStats.stats.find(stat => stat.name === "pointsAllowed")?.displayValue || "N/A",

            // Kicking stats
            fieldGoalAttempts: kickingStats.stats.find(stat => stat.name === "fieldGoalAttempts")?.displayValue || "N/A",
            fieldGoalsMade: kickingStats.stats.find(stat => stat.name === "fieldGoalsMade")?.displayValue || "N/A",
            fieldGoalPercentage: kickingStats.stats.find(stat => stat.name === "fieldGoalPct")?.displayValue || "N/A",
            longestFieldGoalMade: kickingStats.stats.find(stat => stat.name === "longFieldGoalMade")?.displayValue || "N/A",
            totalKickingPoints: kickingStats.stats.find(stat => stat.name === "totalKickingPoints")?.displayValue || "N/A",
 
            // Punting stats
            netAveragePuntYards: puntingStats.stats.find(stat => stat.name === "netAvgPuntYards")?.displayValue || "N/A",
            longestPunt: puntingStats.stats.find(stat => stat.name === "longPunt")?.displayValue || "N/A",
            puntsInside20: puntingStats.stats.find(stat => stat.name === "puntsInside20")?.displayValue || "N/A",
            
            // Turnover stats
            fumbles: generalStats.stats.find(stat => stat.name === "fumbles")?.displayValue || "N/A",
            fumblesLost: generalStats.stats.find(stat => stat.name === "fumblesLost")?.displayValue || "N/A",
            fumblesForced: generalStats.stats.find(stat => stat.name === "fumblesForced")?.displayValue || "N/A",
            fumblesRecovered: generalStats.stats.find(stat => stat.name === "fumblesRecovered")?.displayValue || "N/A",
            interceptions: passingStats.stats.find(stat => stat.name === "interceptions")?.displayValue || "N/A",
            totalTakeaways: miscStats.stats.find(stat => stat.name === "totalTakeaways")?.displayValue || "N/A",
            turnoverDifferential: miscStats.stats.find(stat => stat.name === "turnOverDifferential")?.displayValue || "N/A",
        };

        
    } catch (error) {
        console.error("Error fetching team stats:", error);
        return null;
    }
}


// Function to handle card clicks
async function handleCardClick(cardId) {
    const card = document.getElementById(cardId);

    // Check if the card is already expanded
    if (card.classList.contains("expanded")) {
        collapseCard(card); // Collapse the card if it's expanded
        return; // Exit function after collapsing
    }

    const teamAId = document.getElementById("team-select-a").value;
    const teamBId = document.getElementById("team-select-b").value;

    if (!teamAId || !teamBId) {
        alert("Please select two teams before viewing stats.");
        return;
    }

    const teamAStats = await fetchTeamStats(teamAId, 2024);
    const teamBStats = await fetchTeamStats(teamBId, 2024);

    if (!teamAStats || !teamBStats) {
        alert("Failed to fetch team data. Please try again later.");
        return;
    }

    const teamAName = teamMap.get(teamAId)?.name || "Team A";
    const teamBName = teamMap.get(teamBId)?.name || "Team B";

    updateCardContent(cardId, teamAStats, teamBStats, teamAName, teamBName);
    expandCard(card); // Expand the card after updating content
}

// Function to update card content
function updateCardContent(cardId, statsA, statsB, teamAName, teamBName) {
    const card = document.getElementById(cardId);

    const isOffensiveCard = cardId === "offense-card";
    const isDefensiveCard = cardId === "defense-card";
    const isSpecialTeamsCard = cardId === "special-teams-card";
    const isTurnoverCard = cardId === "turnover-card";

    const compareValues = (valueA, valueB) => {
        const parsedA = parseFloat(valueA.replace(/,/g, '')) || 0;
        const parsedB = parseFloat(valueB.replace(/,/g, '')) || 0;
        if (parsedA > parsedB) return { a: "green", b: "red" };
        if (parsedA < parsedB) return { a: "red", b: "green" };
        return { a: "black", b: "black" };
    };

    const compareStyles = {
        // Offensive stats
        totalYards: compareValues(statsA.totalYards, statsB.totalYards),
        yardsPerGame: compareValues(statsA.yardsPerGame, statsB.yardsPerGame),
        totalPassingYards: compareValues(statsA.totalPassingYards, statsB.totalPassingYards),
        passingYardsPerGame: compareValues(statsA.passingYardsPerGame, statsB.passingYardsPerGame),
        totalRushingYards: compareValues(statsA.totalRushingYards, statsB.totalRushingYards),
        rushingYardsPerGame: compareValues(statsA.rushingYardsPerGame, statsB.rushingYardsPerGame),
        totalPoints: compareValues(statsA.totalPoints, statsB.totalPoints),
        pointsPerGame: compareValues(statsA.pointsPerGame, statsB.pointsPerGame),
    
        // Defensive stats
        totalTackles: compareValues(statsA.totalTackles, statsB.totalTackles),
        sacks: compareValues(statsA.sacks, statsB.sacks),
        interceptions: compareValues(statsA.interceptions, statsB.interceptions),
        defensiveTouchdowns: compareValues(statsA.defensiveTouchdowns, statsB.defensiveTouchdowns),
        passesDefended: compareValues(statsA.passesDefended, statsB.passesDefended),
        soloTackles: compareValues(statsA.soloTackles, statsB.soloTackles),
        tacklesForLoss: compareValues(statsA.tacklesForLoss, statsB.tacklesForLoss),

        // Special Teams stats
        fieldGoalAttempts: compareValues(statsA.fieldGoalAttempts, statsB.fieldGoalAttempts),
        fieldGoalsMade: compareValues(statsA.fieldGoalsMade, statsB.fieldGoalsMade),
        fieldGoalPercentage: compareValues(statsA.fieldGoalPercentage, statsB.fieldGoalPercentage),
        longestFieldGoalMade: compareValues(statsA.longestFieldGoalMade, statsB.longestFieldGoalMade),
        totalKickingPoints: compareValues(statsA.totalKickingPoints, statsB.totalKickingPoints),
        netAveragePuntYards: compareValues(statsA.netAveragePuntYards, statsB.netAveragePuntYards),
        longestPunt: compareValues(statsA.longestPunt, statsB.longestPunt),
        puntsInside20: compareValues(statsA.puntsInside20, statsB.puntsInside20),

        // Turnover stats
        fumbles: compareValues(statsA.fumbles, statsB.fumbles),
        fumblesLost: compareValues(statsA.fumblesLost, statsB.fumblesLost),
        fumblesForced: compareValues(statsA.fumblesForced, statsB.fumblesForced),
        fumblesRecovered: compareValues(statsA.fumblesRecovered, statsB.fumblesRecovered),
        interceptions: compareValues(statsA.interceptions, statsB.interceptions),
        totalTakeaways: compareValues(statsA.totalTakeaways, statsB.totalTakeaways),
        turnoverDifferential: compareValues(statsA.turnoverDifferential, statsB.turnoverDifferential),
    };

    card.innerHTML = `
        <div class="stats-comparison">
            <div class="team-stats">
                <h4>${teamAName || "Team A"}</h4>
                ${isOffensiveCard ? `
                    <p style="color: ${compareStyles.totalYards.a};"><strong>Total Yards:</strong> ${statsA.totalYards}</p>
                    <p style="color: ${compareStyles.yardsPerGame.a};"><strong>Yards Per Game:</strong> ${statsA.yardsPerGame}</p>
                    <p style="color: ${compareStyles.totalPassingYards.a};"><strong>Total Passing Yards:</strong> ${statsA.totalPassingYards}</p>
                    <p style="color: ${compareStyles.passingYardsPerGame.a};"><strong>Passing Yards Per Game:</strong> ${statsA.passingYardsPerGame}</p>
                    <p style="color: ${compareStyles.totalRushingYards.a};"><strong>Total Rushing Yards:</strong> ${statsA.totalRushingYards}</p>
                    <p style="color: ${compareStyles.rushingYardsPerGame.a};"><strong>Rushing Yards Per Game:</strong> ${statsA.rushingYardsPerGame}</p>
                    <p style="color: ${compareStyles.totalPoints.a};"><strong>Total Points:</strong> ${statsA.totalPoints}</p>
                    <p style="color: ${compareStyles.pointsPerGame.a};"><strong>Points Per Game:</strong> ${statsA.pointsPerGame}</p>
                ` : ""}                
                ${isDefensiveCard ? `
                    <p style="color: ${compareStyles.totalTackles.a};"><strong>Total Tackles:</strong> ${statsA.totalTackles}</p>
                    <p style="color: ${compareStyles.sacks.a};"><strong>Sacks:</strong> ${statsA.sacks}</p>
                    <p style="color: ${compareStyles.interceptions.a};"><strong>Interceptions:</strong> ${statsA.interceptions}</p>
                    <p style="color: ${compareStyles.defensiveTouchdowns.a};"><strong>Defensive Touchdowns:</strong> ${statsA.defensiveTouchdowns}</p>
                    <p style="color: ${compareStyles.passesDefended.a};"><strong>Passes Defended:</strong> ${statsA.passesDefended}</p>
                    <p style="color: ${compareStyles.soloTackles.a};"><strong>Solo Tackles:</strong> ${statsA.soloTackles}</p>
                    <p style="color: ${compareStyles.tacklesForLoss.a};"><strong>Tackles For Loss:</strong> ${statsA.tacklesForLoss}</p>
                ` : ""}
                 ${isSpecialTeamsCard ? `
                    <p style="color: ${compareStyles.fieldGoalAttempts.a};"><strong>Field Goal Attempts:</strong> ${statsA.fieldGoalAttempts}</p>
                    <p style="color: ${compareStyles.fieldGoalsMade.a};"><strong>Field Goals Made:</strong> ${statsA.fieldGoalsMade}</p>
                    <p style="color: ${compareStyles.fieldGoalPercentage.a};"><strong>Field Goal Percentage:</strong> ${statsA.fieldGoalPercentage}</p>
                    <p style="color: ${compareStyles.longestFieldGoalMade.a};"><strong>Longest Field Goal Made:</strong> ${statsA.longestFieldGoalMade}</p>
                    <p style="color: ${compareStyles.totalKickingPoints.a};"><strong>Total Kicking Points:</strong> ${statsA.totalKickingPoints}</p>
                    <p style="color: ${compareStyles.netAveragePuntYards.a};"><strong>Net Average Punt Yards:</strong> ${statsA.netAveragePuntYards}</p>
                    <p style="color: ${compareStyles.longestPunt.a};"><strong>Longest Punt:</strong> ${statsA.longestPunt}</p>
                    <p style="color: ${compareStyles.puntsInside20.a};"><strong>Punts Inside 20:</strong> ${statsA.puntsInside20}</p>
                ` : ""}
                ${isTurnoverCard ? `
                    <p style="color: ${compareStyles.fumbles.a};"><strong>Fumbles:</strong> ${statsA.fumbles}</p>
                    <p style="color: ${compareStyles.fumblesLost.a};"><strong>Fumbles Lost:</strong> ${statsA.fumblesLost}</p>
                    <p style="color: ${compareStyles.fumblesForced.a};"><strong>Forced Fumbles:</strong> ${statsA.fumblesForced}</p>
                    <p style="color: ${compareStyles.fumblesRecovered.a};"><strong>Fumbles Recovered:</strong> ${statsA.fumblesRecovered}</p>
                    <p style="color: ${compareStyles.interceptions.a};"><strong>Interceptions:</strong> ${statsA.interceptions}</p>
                    <p style="color: ${compareStyles.totalTakeaways.a};"><strong>Total Takeaways:</strong> ${statsA.totalTakeaways}</p>
                    <p style="color: ${compareStyles.turnoverDifferential.a};"><strong>Turnover Differential:</strong> ${statsA.turnoverDifferential}</p>
                ` : ""}                
            </div>
            <div class="team-stats">
                <h4>${teamBName || "Team B"}</h4>
                ${isOffensiveCard ? `
                    <p style="color: ${compareStyles.totalYards.b};"><strong>Total Yards:</strong> ${statsB.totalYards}</p>
                    <p style="color: ${compareStyles.yardsPerGame.b};"><strong>Yards Per Game:</strong> ${statsB.yardsPerGame}</p>
                    <p style="color: ${compareStyles.totalPassingYards.b};"><strong>Total Passing Yards:</strong> ${statsB.totalPassingYards}</p>
                    <p style="color: ${compareStyles.passingYardsPerGame.b};"><strong>Passing Yards Per Game:</strong> ${statsB.passingYardsPerGame}</p>
                    <p style="color: ${compareStyles.totalRushingYards.b};"><strong>Total Rushing Yards:</strong> ${statsB.totalRushingYards}</p>
                    <p style="color: ${compareStyles.rushingYardsPerGame.b};"><strong>Rushing Yards Per Game:</strong> ${statsB.rushingYardsPerGame}</p>
                    <p style="color: ${compareStyles.totalPoints.b};"><strong>Total Points:</strong> ${statsB.totalPoints}</p>
                    <p style="color: ${compareStyles.pointsPerGame.b};"><strong>Points Per Game:</strong> ${statsB.pointsPerGame}</p>
                ` : ""}                
                ${isDefensiveCard ? `
                    <p style="color: ${compareStyles.totalTackles.b};"><strong>Total Tackles:</strong> ${statsB.totalTackles}</p>
                    <p style="color: ${compareStyles.sacks.b};"><strong>Sacks:</strong> ${statsB.sacks}</p>
                    <p style="color: ${compareStyles.interceptions.b};"><strong>Interceptions:</strong> ${statsB.interceptions}</p>
                    <p style="color: ${compareStyles.defensiveTouchdowns.b};"><strong>Defensive Touchdowns:</strong> ${statsB.defensiveTouchdowns}</p>
                    <p style="color: ${compareStyles.passesDefended.b};"><strong>Passes Defended:</strong> ${statsB.passesDefended}</p>
                    <p style="color: ${compareStyles.soloTackles.b};"><strong>Solo Tackles:</strong> ${statsB.soloTackles}</p>
                    <p style="color: ${compareStyles.tacklesForLoss.b};"><strong>Tackles For Loss:</strong> ${statsB.tacklesForLoss}</p>
                ` : ""}
                 ${isSpecialTeamsCard ? `
                    <p style="color: ${compareStyles.fieldGoalAttempts.b};"><strong>Field Goal Attempts:</strong> ${statsB.fieldGoalAttempts}</p>
                    <p style="color: ${compareStyles.fieldGoalsMade.b};"><strong>Field Goals Made:</strong> ${statsB.fieldGoalsMade}</p>
                    <p style="color: ${compareStyles.fieldGoalPercentage.b};"><strong>Field Goal Percentage:</strong> ${statsB.fieldGoalPercentage}</p>
                    <p style="color: ${compareStyles.longestFieldGoalMade.b};"><strong>Longest Field Goal Made:</strong> ${statsB.longestFieldGoalMade}</p>
                    <p style="color: ${compareStyles.totalKickingPoints.b};"><strong>Total Kicking Points:</strong> ${statsB.totalKickingPoints}</p>
                    <p style="color: ${compareStyles.netAveragePuntYards.b};"><strong>Net Average Punt Yards:</strong> ${statsB.netAveragePuntYards}</p>
                    <p style="color: ${compareStyles.longestPunt.b};"><strong>Longest Punt:</strong> ${statsB.longestPunt}</p>
                    <p style="color: ${compareStyles.puntsInside20.b};"><strong>Punts Inside 20:</strong> ${statsB.puntsInside20}</p>
                ` : ""}
                ${isTurnoverCard ? `
                    <p style="color: ${compareStyles.fumbles.b};"><strong>Fumbles:</strong> ${statsB.fumbles}</p>
                    <p style="color: ${compareStyles.fumblesLost.b};"><strong>Fumbles Lost:</strong> ${statsB.fumblesLost}</p>
                    <p style="color: ${compareStyles.fumblesForced.b};"><strong>Forced Fumbles:</strong> ${statsB.fumblesForced}</p>
                    <p style="color: ${compareStyles.fumblesRecovered.b};"><strong>Fumbles Recovered:</strong> ${statsB.fumblesRecovered}</p>
                    <p style="color: ${compareStyles.interceptions.b};"><strong>Interceptions:</strong> ${statsB.interceptions}</p>
                    <p style="color: ${compareStyles.totalTakeaways.b};"><strong>Total Takeaways:</strong> ${statsB.totalTakeaways}</p>
                    <p style="color: ${compareStyles.turnoverDifferential.b};"><strong>Turnover Differential:</strong> ${statsB.turnoverDifferential}</p>
                ` : ""}             
            </div>
        </div>
    `;
}



// Function to expand a specific card and hide others
function expandCard(card) {
  const allCards = document.querySelectorAll(".stats-card");

  allCards.forEach(c => {
      if (c !== card) c.classList.add("hidden");
  });

  card.classList.add("expanded");

  const expandLabel = card.querySelector(".expand-label");
  if (expandLabel) expandLabel.style.display = "none";
}

// Function to collapse the card and show others
function collapseCard(card) {
  const allCards = document.querySelectorAll(".stats-card");

  allCards.forEach(c => c.classList.remove("hidden"));
  card.classList.remove("expanded");

  const expandLabel = card.querySelector(".expand-label");
  if (expandLabel) expandLabel.style.display = "block";

  card.innerHTML = `
      <img src="helmet-${card.id.split('-')[0]}.png" alt="${card.id.split('-')[0]} Helmet">
      <h4>${card.id.split('-')[0].replace(/-/g, ' ')}</h4>
      <p class="expand-label">Click to Expand</p>
  `;
}

// Attach event listeners to cards
document.getElementById("offense-card").addEventListener("click", () => handleCardClick("offense-card"));
document.getElementById("defense-card").addEventListener("click", () => handleCardClick("defense-card"));
document.getElementById("special-teams-card").addEventListener("click", () => handleCardClick("special-teams-card"));
document.getElementById("turnover-card").addEventListener("click", () => handleCardClick("turnover-card"));
