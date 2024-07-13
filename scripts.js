document.addEventListener('DOMContentLoaded', function () {
  loadHeaderFooter();

  // Dropdown functionality for mobile view
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

function showDrunkModePopup() {
  const popup = document.getElementById('drunkModePopup');
  popup.classList.remove('hidden');
  document.body.classList.add('overlay');
}

function unlockDrunkMode() {
  const popup = document.getElementById('drunkModePopup');
  popup.classList.add('hidden');
  document.body.classList.remove('overlay');
  const buttonContainer = document.querySelector('.profile-view .stats button');
  buttonContainer.style.display = 'block';
}

function goBack() {
  window.history.back();
}
