// projection.js

function calculateProjection() {
  const qb = document.getElementById('qb').value;
  const wr1 = document.getElementById('wr1').value;
  const wr2 = document.getElementById('wr2').value;
  const rb1 = document.getElementById('rb1').value;
  const rb2 = document.getElementById('rb2').value;
  const te = document.getElementById('te').value;
  const flex = document.getElementById('flex').value;
  const k = document.getElementById('k').value;
  const defense = document.getElementById('defense').value;

  if (!qb || !wr1 || !wr2 || !rb1 || !rb2 || !te || !flex || !k || !defense) {
      alert('Please fill in all lineup positions.');
      return;
  }

  const projectedPoints = Math.floor(Math.random() * 200);
  const winProbability = Math.floor(Math.random() * 100);

  document.getElementById('projected-score').textContent = `Projected Points: ${projectedPoints}`;
  document.getElementById('win-probability').textContent = `Win Probability: ${winProbability}%`;
}
