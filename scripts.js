document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Confidence', 'Bothersome', 'Destruction', 'Gentleness', 'Speech'],
      datasets: [{
        label: 'Patrick\'s Stats',
        data: [50, 55, 5, 85, 65],
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            color: '#000'
          },
          ticks: {
            display: false
          }
        }
      }
    }
  });

  setTimeout(function () {
    const button = document.getElementById('drunkModeButton');
    button.classList.remove('hidden');
  }, 3000);
});

function showDrunkModePopup() {
  const popup = document.getElementById('drunkModePopup');
  popup.style.display = 'flex';
  document.body.classList.add('overlay');
}

function unlockDrunkMode() {
  const popup = document.getElementById('drunkModePopup');
  popup.style.display = 'none';
  document.body.classList.remove('overlay');

  const button = document.getElementById('drunkModeButton');
  button.style.backgroundColor = '#000';
  button.style.color = '#fff';
  button.style.fontFamily = 'Poppins, sans-serif';
  button.textContent = 'Unlock Drunk Mode';

  const stats = document.querySelector('.profile-view .stats');
  const buttonContainer = stats.querySelector('button');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '10px';
  buttonContainer.style.right = '10px';
  buttonContainer.style.display = 'block';
}
