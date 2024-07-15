// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCZURzxdOwJauWX-CT8BYN1VSQ5a7JJWBk",
    authDomain: "expense-f7fb3.firebaseapp.com",
    projectId: "expense-f7fb3",
    storageBucket: "expense-f7fb3.appspot.com",
    messagingSenderId: "240992662446",
    appId: "1:240992662446:web:b06e29ebefe8fa1e7f4e3f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseTable = document.getElementById('expenseTable');
    const editModal = document.getElementById('editModal');
    const editExpenseForm = document.getElementById('editExpenseForm');
    const closeModal = document.querySelector('.close');
    const trackerButton = document.getElementById('trackerButton');
    const matrixButton = document.getElementById('matrixButton');
    const container = document.querySelector('.container');
    const matrixContainer = document.getElementById('matrixContainer');
    let expenses = [];

    const getSelectedCheckboxes = (name) => {
        const checkboxes = document.querySelectorAll(`input[id^=${name}]:checked`);
        return Array.from(checkboxes).map(checkbox => checkbox.value).join(', ');
    };

    const addExpenseToTable = (expense, id) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', id);
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.person}</td>
            <td>${expense.involved}</td>
            <td>${expense.location}</td>
            <td>${expense.description}</td>
            <td>$${parseFloat(expense.amount).toFixed(2)}</td>
            <td class="actions">
                <button onclick="editExpense('${id}')">Edit</button>
                <button class="delete" onclick="removeExpense('${id}')">Delete</button>
            </td>
        `;
        expenseTable.appendChild(row);
    };

    const loadExpenses = () => {
        db.collection('expenses').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const expense = doc.data();
                addExpenseToTable(expense, doc.id);
            });
        });
    };

    window.removeExpense = (id) => {
        db.collection('expenses').doc(id).delete().then(() => {
            const row = document.querySelector(`tr[data-id='${id}']`);
            row.remove();
        });
    };

    window.editExpense = (id) => {
        db.collection('expenses').doc(id).get().then(doc => {
            const expense = doc.data();
            document.getElementById('editIndex').value = id;
            document.getElementById('editDate').value = expense.date;
            document.getElementById('editPerson').value = expense.person;
            document.querySelectorAll('input[id^=editInvolved]').forEach(checkbox => {
                checkbox.checked = expense.involved.includes(checkbox.value);
            });
            document.getElementById('editLocation').value = expense.location;
            document.getElementById('editDescription').value = expense.description;
            document.getElementById('editAmount').value = expense.amount;
            editModal.style.display = 'block';
        });
    };

    editExpenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('editIndex').value;
        const date = document.getElementById('editDate').value;
        const person = document.getElementById('editPerson').value;
        const involved = getSelectedCheckboxes('editInvolved');
        const location = document.getElementById('editLocation').value;
        const description = document.getElementById('editDescription').value;
        const amount = document.getElementById('editAmount').value;

        const expense = { date, person, involved, location, description, amount };
        db.collection('expenses').doc(id).set(expense).then(() => {
            window.location.reload();
        });
    });

    closeModal.onclick = () => {
        editModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    };

    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const person = document.getElementById('person').value;
        const involved = getSelectedCheckboxes('involved');
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;

        const expense = { date, person, involved, location, description, amount };
        db.collection('expenses').add(expense).then(docRef => {
            addExpenseToTable(expense, docRef.id);
            expenseForm.reset();
            triggerExplosion();
        });
    });

    const calculateExpenseMatrix = () => {
        const people = ['Julia', 'Tik', 'David', 'Jen'];
        const matrix = {};
        people.forEach(p => {
            matrix[p] = {};
            people.forEach(q => {
                matrix[p][q] = 0;
            });
        });

        expenses.forEach(expense => {
            const involvedPeople = expense.involved.split(', ').filter(person => person !== expense.person);
            const amountPerPerson = parseFloat(expense.amount) / (involvedPeople.length + 1);
            involvedPeople.forEach(person => {
                matrix[expense.person][person] += amountPerPerson;
                matrix[person][expense.person] -= amountPerPerson;
            });
        });

        const matrixTable = document.getElementById('matrixTable').getElementsByTagName('tbody')[0];
        matrixTable.innerHTML = '';
        people.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `<th>${p}</th>` + people.map(q => `<td>${matrix[p][q] !== 0 ? '$' + Math.abs(matrix[p][q]).toFixed(2) : '-'}</td>`).join('');
            matrixTable.appendChild(row);
        });
    };

    const showExpenseTracker = () => {
        container.style.display = 'block';
        matrixContainer.style.display = 'none';
    };

    const showExpenseMatrix = () => {
        container.style.display = 'none';
        matrixContainer.style.display = 'block';
        calculateExpenseMatrix();
    };

    trackerButton.addEventListener('click', showExpenseTracker);
    matrixButton.addEventListener('click', showExpenseMatrix);

    loadExpenses();

    function triggerExplosion() {
        const particlesId = 'particles-js';
        let particlesDiv = document.getElementById(particlesId);

        if (particlesDiv) {
            particlesDiv.remove();
        }

        particlesDiv = document.createElement('div');
        particlesDiv.id = particlesId;
        container.appendChild(particlesDiv);

        particlesJS(particlesId, {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "image",
                    image: {
                        src: "https://cdn-icons-png.flaticon.com/128/12740/12740855.png",
                        width: 100,
                        height: 100
                    }
                },
                opacity: {
                    value: 0.5,
                    anim: {
                        enable: true,
                        speed: 1.5,
                        opacity_min: 0
                    }
                },
                size: {
                    value: 10,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.3
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    }
                }
            },
            retina_detect: true
        });

        setTimeout(() => {
            if (particlesDiv) {
                particlesDiv.style.transition = 'opacity 1s';
                particlesDiv.style.opacity = '0';
                setTimeout(() => {
                    if (particlesDiv) {
                        particlesDiv.remove();
                    }
                }, 1000);
            }
        }, 1000);
    }
});
