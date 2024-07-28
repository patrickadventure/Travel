document.addEventListener('DOMContentLoaded', function() {
    loadHeaderFooter();
});

function loadHeaderFooter() {
    if (!document.querySelector('header')) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                setupDropdown(); // Setup dropdown after the header is loaded
            });
    }

    if (!document.querySelector('footer')) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            });
    }
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
