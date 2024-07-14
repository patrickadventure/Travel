document.addEventListener('DOMContentLoaded', function() {
    loadHeaderFooter();
});

function loadHeaderFooter() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            setupDropdown(); // Setup dropdown after the header is loaded
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
}

function setupDropdown() {
    // Dropdown functionality for mobile view
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    dropdownToggles.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
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
