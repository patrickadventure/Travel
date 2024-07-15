document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseTable = document.getElementById('expenseTable');
    const editModal = document.getElementById('editModal');
    const editExpenseForm = document.getElementById('editExpenseForm');
    const trackerContainer = document.getElementById('trackerContainer');
    const matrixContainer = document.getElementById('matrixContainer');
    const trackerButton = document.getElementById('trackerButton');
    const matrixButton = document.getElementById('matrixButton');
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const person = document.getElementById('person').value;
        const involved = getSelectedCheckboxes('involved');
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;

        const expense = { date, person, involved, location, description, amount };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        addExpenseToTable(expense, expenses.length - 1);
        this.reset();
        triggerExplosion(); // Trigger the explosion effect
    });

    const getSelectedCheckboxes = (name) => {
        const checkboxes = document.querySelectorAll(`input[id^=${name}]:checked`);
        return Array.from(checkboxes).map(checkbox => checkbox.value).join(', ');
    };

    const addExpenseToTable = (expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.person}</td>
            <td>${expense.involved}</td>
            <td>${expense.location}</td>
            <td>${expense.description}</td>
            <td>$${parseFloat(expense.amount).toFixed(2)}</td>
            <td class="actions">
                <button onclick="editExpense(${index})">Edit</button>
                <button class="delete" onclick="removeExpense(${index})">Delete</button>
            </td>
        `;
        expenseTable.appendChild(row);
    };

    const loadExpenses = () => {
        expenseTable.innerHTML = '';
        expenses.forEach((expense, index) => addExpenseToTable(expense, index));
    };

    window.removeExpense = (index) => {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        loadExpenses();
    };

    window.editExpense = (index) => {
        const expense = expenses[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editDate').value = expense.date;
        document.getElementById('editPerson').value = expense.person;
        document.querySelectorAll('input[id^=editInvolved]').forEach(checkbox => {
            checkbox.checked = expense.involved.includes(checkbox.value);
        });
        document.getElementById('editLocation').value = expense.location;
        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editAmount').value = expense.amount;
        editModal.style.display = 'block';
    };

    editExpenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('editIndex').value;
        const date = document.getElementById('editDate').value;
        const person = document.getElementById('editPerson').value;
        const involved = getSelectedCheckboxes('editInvolved');
        const location = document.getElementById('editLocation').value;
        const description = document.getElementById('editDescription').value;
        const amount = document.getElementById('editAmount').value;

        expenses[index] = { date, person, involved, location, description, amount };
        localStorage.setItem('expenses', JSON.stringify(expenses));
        window.location.reload();
    });

    trackerButton.onclick = () => {
        trackerContainer.style.display = 'block';
        matrixContainer.style.display = 'none';
    };

    matrixButton.onclick = () => {
        trackerContainer.style.display = 'none';
        matrixContainer.style.display = 'block';
        updateMatrix();
    };

    const updateMatrix = () => {
        const people = ['Julia', 'Tik', 'David', 'Jen'];
        const matrix = {};

        // Initialize the matrix
        people.forEach(person => {
            matrix[person] = {};
            people.forEach(otherPerson => {
                matrix[person][otherPerson] = 0;
            });
        });

        // Calculate the balances
        expenses.forEach(expense => {
            const involved = expense.involved.split(', ');
            const splitAmount = parseFloat(expense.amount) / involved.length;

            involved.forEach(person => {
                if (person !== expense.person) {
                    matrix[person][expense.person] += splitAmount;
                    matrix[expense.person][person] -= splitAmount;
                }
            });
        });

        // Update the matrix table
        const matrixTable = document.getElementById('matrixTable').getElementsByTagName('tbody')[0];
        matrixTable.innerHTML = '';
        people.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${person}</td>`;
            people.forEach(otherPerson => {
                if (matrix[person][otherPerson] === 0) {
                    row.innerHTML += '<td>-</td>';
                } else {
                    row.innerHTML += `<td>$${matrix[person][otherPerson].toFixed(2)}</td>`;
                }
            });
            matrixTable.appendChild(row);
        });
    };

    loadExpenses();

    function triggerExplosion() {
        // Assuming 'container' is the main element of your expense tracker
        const container = document.querySelector('.container');
        if (!container) return; // If container is not found, don't proceed

        const particlesId = 'particles-js';
        let particlesDiv = document.getElementById(particlesId);

        // Remove existing particles to prevent duplicates
        if (particlesDiv) {
            particlesDiv.remove();
        }

        // Create a new particles container
        particlesDiv = document.createElement('div');
        particlesDiv.id =
