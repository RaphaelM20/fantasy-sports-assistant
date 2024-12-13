// main.js

// Redirect to login if no token is found
const token = localStorage.getItem('token');
if (!token) {
    alert("You need to log in to access this page.");
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
}

// Show/Hide Header on Scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        header.classList.remove('nav-visible');
    } else {
        header.classList.add('nav-visible');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Dummy data for best offenses and defenses
const offenses = [
  'Team A', 'Team B', 'Team C', 'Team D', 'Team E',
  'Team F', 'Team G', 'Team H', 'Team I', 'Team J',
  'Team K', 'Team L', 'Team M', 'Team N', 'Team O',
  'Team P', 'Team Q', 'Team R', 'Team S', 'Team T',
  'Team U', 'Team V', 'Team W', 'Team X', 'Team Y',
  'Team Z', 'Team AA', 'Team AB', 'Team AC', 'Team AD',
  'Team AE', 'Team AF'
];

const defenses = [
  'Team Z', 'Team Y', 'Team X', 'Team W', 'Team V',
  'Team U', 'Team T', 'Team S', 'Team R', 'Team Q',
  'Team P', 'Team O', 'Team N', 'Team M', 'Team L',
  'Team K', 'Team J', 'Team I', 'Team H', 'Team G',
  'Team F', 'Team E', 'Team D', 'Team C', 'Team B',
  'Team A', 'Team AG', 'Team AH', 'Team AI', 'Team AJ',
  'Team AK', 'Team AL'
];

const offensesList = document.getElementById('offenses-list');
offenses.forEach((team, index) => {
  const li = document.createElement('li');
  li.textContent = `${index + 1}. ${team}`;
  offensesList.appendChild(li);
});

const defensesList = document.getElementById('defenses-list');
defenses.forEach((team, index) => {
  const li = document.createElement('li');
  li.textContent = `${index + 1}. ${team}`;
  defensesList.appendChild(li);
});

// After all initial setup, we can load the matchups
loadCurrentWeekMatchups();