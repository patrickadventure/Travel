document.addEventListener('DOMContentLoaded', function () {
  loadHeaderFooter();

  const dropdown = document.querySelector('.dropdown > a');
  if (dropdown) {
    dropdown.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentElement.classList.toggle('active');
    });
  }
});

function loadHeaderFooter() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
    });

  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    });
}

function viewProfile(name) {
  const profiles = {
    patrick: {
      name: 'Patrick Dhital',
      job: 'Role or Job Title',
      image: 'https://i.imgur.com/wHVzcz7.png',
      bio: 'This is a funny bio about Patrick Dhital. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      stats: {
        labels: ['Confidence', 'Bothersome', 'Destruction', 'Gentleness', 'Speech'],
        data: [50, 55, 5, 85, 65]
      }
    }
    // Add more profiles here as needed
  };

  const profile = profiles[name];
  if (profile) {
    document.getElementById('main-content').innerHTML = `
      <div class="profile-view">
        <div class="left">
          <div class="image"><img src="${profile.image}" alt="${profile.name}"></div>
          <div class="name">${profile.name}</div>
          <div class="job">${profile.job}</div>
          <div class="stats">
            <canvas id="radarChart"></canvas>
          </div>
        </div>
        <div class="right">
          <div class="bio">${profile.bio}</div>
        </div>
      </div>
    `;

    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: profile.stats.labels,
        datasets: [{
          label: `${profile.name}'s Stats`,
          data: profile.stats.data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    setTimeout(showDrunkModePopup, 3000);
  }
}

function showDrunkModePopup() {
  const popup = document.createElement('div');
  popup.id = 'drunkModePopup';
  popup.innerHTML = `
    <p>Click the button to unlock Drunk Mode!</p>
    <button onclick="unlockDrunkMode()">Unlock Drunk Mode</button>
  `;
  document.body.appendChild(popup);
}

function unlockDrunkMode() {
  const popup = document.getElementById('drunkModePopup');
  if (popup) {
    popup.remove();
  }
  const bio = document.querySelector('.profile-view .bio');
  if (bio) {
    bio.innerHTML += `
      <div>
        <button onclick="unlockDrunkMode()">Unlock Drunk Mode</button>
      </div>
    `;
  }
}

function goBack() {
  document.getElementById('main-content').innerHTML = `
    <h1>People Involved</h1>
    <div id="profiles">
      <div class="profile-card" onclick="viewProfile('patrick')">
        <div class="image">
          <img src="https://via.placeholder.com/70" width="70" height="70" alt="Patrick Dhital">
        </div>
        <div class="name">Patrick Dhital</div>
        <div class="job">Role or Job Title</div>
        <button class="btn" onclick="viewProfile('patrick')">View Profile</button>
      </div>
      <!-- Add more profiles here -->
    </div>
  `;
}
