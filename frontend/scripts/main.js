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

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  console.log("[Main.js] App initialized.");
});
