// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZURzxdOwJauWX-CT8BYN1VSQ5a7JJWBk",
  authDomain: "expense-f7fb3.firebaseapp.com",
  projectId: "expense-f7fb3",
  storageBucket: "expense-f7fb3.appspot.com",
  messagingSenderId: "240992662446",
  appId: "1:240992662446:web:b06e29ebefe8fa1e7f4e3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseTable = document.getElementById('expenseTable');
    const editModal = document.getElementById('editModal');
    const editExpenseForm = document.getElementById('editExpenseForm');
    const trackerContainer = document.getElementById('trackerContainer');
    const matrixContainer = document.getElementById('matrixContainer');
    const trackerButton = document.getElementById('trackerButton');
    const matrixButton = document.getElementById('matrixButton');
    let expenses = [];

    const loadExpenses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'expenses'));
            console.log("Expenses fetched successfully.");
            expenses = [];
            querySnapshot.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                expenses.push(data);
            });
            renderExpenseTable();
            updateMatrix();
        } catch (error) {
            console.error("Error fetching expenses: ", error);
        }
    };

    expenseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const person = document.getElementById('person').value;
        const involved = getSelectedCheckboxes('involved');
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;

        const expense = { date, person, involved, location, description, amount };

        try {
            const docRef = await addDoc(collection(db, 'expenses'), expense);
            console.log("Expense added successfully.");
            expense.id = docRef.id;
            expenses.push(expense);
            addExpenseToTable(expense);
            expenseForm.reset();
            triggerExplosion();
        } catch (error) {
            console.error("Error adding expense: ", error);
        }
    });

    const getSelectedCheckboxes = (name) => {
        const checkboxes = document.querySelectorAll(`input[id^=${name}]:checked`);
        return Array.from(checkboxes).map(checkbox => checkbox.value).join(', ');
    };

    const addExpenseToTable = (expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.person}</td>
            <td>${expense.involved}</td>
            <td>${expense.location}</td>
            <td>${expense.description}</td>
            <td>$${parseFloat(expense.amount).toFixed(2)}</td>
            <td class="actions">
                <button onclick="editExpense('${expense.id}')">Edit</button>
                <button class="delete" onclick="removeExpense('${expense.id}')">Delete</button>
            </td>
        `;
        expenseTable.appendChild(row);
    };

    const renderExpenseTable = () => {
        expenseTable.innerHTML = '';
        expenses.forEach(expense => addExpenseToTable(expense));
    };

    window.removeExpense = async (id) => {
        try {
            await deleteDoc(doc(db, 'expenses', id));
            expenses = expenses.filter(expense => expense.id !== id);
            renderExpenseTable();
        } catch (error) {
            console.error("Error removing expense: ", error);
        }
    };

    window.editExpense = (id) => {
        const expense = expenses.find(expense => expense.id === id);
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
    };

    editExpenseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('editIndex').value;
        const date = document.getElementById('editDate').value;
        const person = document.getElementById('editPerson').value;
        const involved = getSelectedCheckboxes('editInvolved');
        const location = document.getElementById('editLocation').value;
        const description = document.getElementById('editDescription').value;
        const amount = document.getElementById('editAmount').value;

        const expense = { date, person, involved, location, description, amount };

        try {
            await setDoc(doc(db, 'expenses', id), expense);
            expenses = expenses.map(exp => exp.id === id ? { ...expense, id } : exp);
            renderExpenseTable();
            editModal.style.display = 'none';
        } catch (error) {
            console.error("Error editing expense: ", error);
        }
    });

    trackerButton.onclick = () => {
        console.log("Tracker Button Clicked");
        trackerContainer.style.display = 'block';
        matrixContainer.style.display = 'none';
    };

    matrixButton.onclick = () => {
        console.log("Matrix Button Clicked");
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
                if (person !== otherPerson) {
                    matrix[person][otherPerson] = 0; // Only initialize for different people
                }
            });
        });
    
        // Calculate the balances
        expenses.forEach(expense => {
            const involved = expense.involved.split(', ');
            const splitAmount = parseFloat(expense.amount) / involved.length;
    
            involved.forEach(involvedPerson => {
                if (involvedPerson !== expense.person) {
                    matrix[involvedPerson][expense.person] += splitAmount; // Person owes the payer
                    matrix[expense.person][involvedPerson] -= splitAmount; // Payer is owed by the person
                }
            });
        });
    
        // Update the matrix table
        const matrixTable = document.getElementById('matrixTable').getElementsByTagName('tbody')[0];
        matrixTable.innerHTML = '';
        people.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${person} Owes</td>`; // Adjust to indicate the direction of debt
            people.forEach(otherPerson => {
                if (person !== otherPerson) {
                    let balance = matrix[person][otherPerson];
                    if (balance > 0) {
                        row.innerHTML += `<td>$${balance.toFixed(2)}</td>`; // Show only amounts that person owes
                    } else {
                        row.innerHTML += '<td>-</td>';
                    }
                }
            });
            matrixTable.appendChild(row);
        });
    };

    await loadExpenses();

    window.triggerExplosion = function() {
        const container = document.querySelector('.container');
        if (!container) return;

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
