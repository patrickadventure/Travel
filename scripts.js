document.addEventListener('DOMContentLoaded', function () {
  loadHeaderFooter();

  const dropdown = document.querySelector('.dropdown > a');
  dropdown.addEventListener('click', function (e) {
    e.preventDefault();
    this.parentElement.classList.toggle('active');
  });
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
      image: 'https://via.placeholder.com/70',
      posts: 523,
      likes: 1387,
      followers: 146
    }
    // Add more profiles here as needed
  };

  const profile = profiles[name];
  if (profile) {
    document.getElementById('main-content').innerHTML = `
      <div class="profile-view">
        <div class="image"><img src="${profile.image}" alt="${profile.name}"></div>
        <div class="name">${profile.name}</div>
        <div class="job">${profile.job}</div>
        <div class="stats">
          <div class="box">
            <span class="value">${profile.posts}</span>
            <span class="parameter">Posts</span>
          </div>
          <div class="box">
            <span class="value">${profile.likes}</span>
            <span class="parameter">Likes</span>
          </div>
          <div class="box">
            <span class="value">${profile.followers}</span>
            <span class="parameter">Followers</span>
          </div>
        </div>
        <button class="btn" onclick="goBack()">Go Back</button>
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
