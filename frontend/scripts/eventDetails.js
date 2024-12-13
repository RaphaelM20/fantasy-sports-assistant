// eventDetails.js

async function loadEventDetails(eventId) {
  const eventDetailsDiv = document.getElementById('event-details');
  eventDetailsDiv.innerHTML = 'Loading event details...';

  try {
      const response = await fetch(`/api/event-details?id=${eventId}`);
      const data = await response.json();

      const eventName = data.name;
      const date = new Date(data.date);
      const formattedDate = date.toLocaleString(undefined, { 
        dateStyle: 'medium', timeStyle: 'short' 
      });

      const competition = data.competitions[0];
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

      const homeTeamName = homeTeam.team.displayName;
      const awayTeamName = awayTeam.team.displayName;
      const winner = homeTeam.winner ? homeTeamName : (awayTeam.winner ? awayTeamName : 'No winner');

      const venue = `${competition.venue.fullName}, ${competition.venue.address.city}, ${competition.venue.address.state}`;

      eventDetailsDiv.innerHTML = `
          <h3>${eventName}</h3>
          <p><strong>Date/Time:</strong> ${formattedDate}</p>
          <p><strong>Venue:</strong> ${venue}</p>
          <p><strong>Matchup:</strong> ${awayTeamName} @ ${homeTeamName}</p>
          <p><strong>Winner:</strong> ${winner}</p>
      `;
  } catch (error) {
      console.error('Error loading event details:', error);
      eventDetailsDiv.innerHTML = 'Failed to load event details.';
  }
}
