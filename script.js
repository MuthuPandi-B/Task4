// Initialize Variables
let entries = JSON.parse(localStorage.getItem('entries')) || [];
const entriesList = document.getElementById('entriesList');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const netBalance = document.getElementById('netBalance');

// Event Listeners
document.getElementById('addEntryBtn').addEventListener('click', addEntry);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', filterEntries);
});

// Add New Entry
function addEntry() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description && amount) {
        const entry = {
            id: Date.now(),
            description,
            amount,
            type
        };
        entries.push(entry);
        updateLocalStorage();
        renderEntries();
        clearForm();
    }
}

// Render Entries List
function renderEntries() {
    entriesList.innerHTML = '';
    const filter = document.querySelector('input[name="filter"]:checked').value;
    
    let filteredEntries = entries;
    if (filter !== 'all') {
        filteredEntries = entries.filter(entry => entry.type === filter);
    }

    filteredEntries.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${entry.description} - $${entry.amount} (${entry.type})
            <div>
                <button onclick="editEntry(${entry.id})">Edit</button>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
        `;
        entriesList.appendChild(listItem);
    });

    updateTotals();
}

// Edit Entry
function editEntry(id) {
    const entry = entries.find(e => e.id === id);
    document.getElementById('description').value = entry.description;
    document.getElementById('amount').value = entry.amount;
    document.getElementById('type').value = entry.type;
    deleteEntry(id);
}

// Delete Entry
function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    renderEntries();
}

// Filter Entries
function filterEntries() {
    renderEntries();
}

// Update Totals
function updateTotals() {
    const income = entries.filter(entry => entry.type === 'income').reduce((acc, entry) => acc + entry.amount, 0);
    const expense = entries.filter(entry => entry.type === 'expense').reduce((acc, entry) => acc + entry.amount, 0);
    
    totalIncome.innerText = income;
    totalExpense.innerText = expense;
    netBalance.innerText = income - expense;
}

// Clear Form
function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = 'income';
}

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Initial Render
renderEntries();