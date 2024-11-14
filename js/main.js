        // JavaScript код для обработки ввода и запросов к API
        const searchInput = document.querySelector('.search-form__input');
        const suggestionsContainer = document.querySelector('.search-results');
        let allSenders = [];

        // Функция для получения списка отправителей
        async function fetchSenders() {
            const response = await fetch('http://127.0.0.1:8000/api/get_senders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            allSenders = data;
        }

        // Функция для отображения подсказок
        function showSuggestions(query) {
            const filteredSenders = allSenders.filter(sender => sender.toLowerCase().includes(query.toLowerCase()));
            suggestionsContainer.innerHTML = '';
            filteredSenders.slice(0, 10).forEach(sender => {
                const suggestionElement = document.createElement('div');
                suggestionElement.textContent = sender;
                suggestionElement.addEventListener('click', () => {
                    searchInput.value = sender;
                    suggestionsContainer.style.display = 'none';
                    document.body.classList.remove('modal-open'); // Убираем класс, чтобы возобновить прокрутку
                });
                suggestionsContainer.appendChild(suggestionElement);
            });
            suggestionsContainer.style.display = filteredSenders.length > 0 ? 'block' : 'none';
            document.body.classList.add('modal-open'); // Добавляем класс, чтобы заблокировать прокрутку
        }

        // Обработчик ввода
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                showSuggestions(query);
            } else {
                suggestionsContainer.style.display = 'none';
                document.body.classList.remove('modal-open'); // Убираем класс, чтобы возобновить прокрутку
            }
        });

        // Загрузка списка отправителей при загрузке страницы
        window.addEventListener('load', () => {
            fetchSenders().then(() => {
                console.log('Senders loaded');
            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });

        // Инициализация календаря
        const calendarContainer = document.getElementById('calendar-container');
        const datetimePicker = document.getElementById('datetime-picker');
        const sortButton = document.querySelector('.sort-button');
        const sortTrigger = document.querySelector('.sort-trigger');
        const messagesTable = document.getElementById('messages-table');
        const tbody = messagesTable.querySelector('tbody');

        flatpickr(datetimePicker, {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            time_24hr: true,
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    sortButton.style.display = 'block';
                } else {
                    sortButton.style.display = 'none';
                }
            }
        });

        sortTrigger.addEventListener('click', () => {
            calendarContainer.style.display = 'block';
        });

        sortButton.addEventListener('click', () => {
            const selectedDate = datetimePicker.value;
            if (selectedDate) {
                sortTableByDateTime(selectedDate);
                calendarContainer.style.display = 'none'; // Скрываем календарь после сортировки
            }
        });

        function sortTableByDateTime(selectedDate) {
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.sort((a, b) => {
                const dateA = new Date(a.cells[0].textContent);
                const dateB = new Date(b.cells[0].textContent);
                return dateA - dateB;
            });

            rows.forEach(row => tbody.appendChild(row));
        }

        // Загрузка данных с сервера и отображение их в таблице
        async function fetchMessages() {
            const response = await fetch('http://127.0.0.1:8000/api/messages', {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayMessages(data);
        }

        function displayMessages(messages) {
            tbody.innerHTML = '';
            messages.forEach(message => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${message.date}</td>
                    <td>${message.sender}</td>
                    <td>${message.recipient}</td>
                    <td>${message.ip}</td>
                    <td>${message.size}</td>
                    <td>${message.check}</td>
                    <td>${message.data_box}</td>
                    <td>${message.status}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // Загрузка данных при загрузке страницы
        window.addEventListener('load', () => {
            fetchMessages().then(() => {
                console.log('Messages loaded');
            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });

// период

const modal = document.getElementById('modal');
const periodButton = document.querySelector('.period-trigger');
const closeModal = document.querySelector('.close');
const startDatePicker = document.getElementById('start-date');
const endDatePicker = document.getElementById('end-date');
const applyFilterButton = document.getElementById('apply-filter');

// Проверка на существование элементов перед добавлением обработчиков событий
if (periodButton) {
    periodButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

if (applyFilterButton) {
    applyFilterButton.addEventListener('click', () => {
        const startDate = startDatePicker.value;
        const endDate = endDatePicker.value;

        if (startDate && endDate) {
            filterMessagesByDate(startDate, endDate);
            modal.style.display = 'none';
        } else {
            console.log('Please select both start and end dates.');
        }
    });
}

// Закрытие модального окна по клику вне его
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Закрытие модального окна по нажатию Esc
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// Инициализация календарей
if (startDatePicker && endDatePicker) {
    flatpickr(startDatePicker, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        onChange: function(selectedDates, dateStr, instance) {
            console.log('Start Date Selected:', dateStr);
            startDatePicker.value = dateStr;
        }
    });

    flatpickr(endDatePicker, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        onChange: function(selectedDates, dateStr, instance) {
            console.log('End Date Selected:', dateStr);
            endDatePicker.value = dateStr;
        }
    });
}

function filterMessagesByDate(startDate, endDate) {
    const messagesTable = document.getElementById('messages-table');
    if (messagesTable) {
        const tbody = messagesTable.querySelector('tbody');
        if (tbody) {
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.forEach(row => {
                const date = row.cells[0].textContent;
                if (date >= startDate && date <= endDate) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    }
}

// Загрузка данных с сервера и отображение их в таблице
async function fetchMessages() {
    const response = await fetch('http://127.0.0.1:8000/api/messages', {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    displayMessages(data);
}

function displayMessages(messages) {
    const messagesTable = document.getElementById('messages-table');
    if (messagesTable) {
        const tbody = messagesTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            messages.forEach(message => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${message.date}</td>
                    <td>${message.sender}</td>
                    <td>${message.recipient}</td>
                    <td>${message.ip}</td>
                    <td>${message.size}</td>
                    <td>${message.check}</td>
                    <td>${message.data_box}</td>
                    <td>${message.status}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}

// Загрузка данных при загрузке страницы
window.addEventListener('load', () => {
    fetchSenders().then(() => {
        console.log('Senders loaded');
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    fetchMessages().then(() => {
        console.log('Messages loaded');
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});