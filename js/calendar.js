const modal = document.getElementById('modal');
const periodButton = document.querySelector('.period-trigger');
const closeModal = document.querySelector('.close');
const startDatePicker = document.getElementById('start-date');
const endDatePicker = document.getElementById('end-date');
const applyFilterButton = document.getElementById('apply-filter');
const calendarContainer = document.getElementById('calendar-container');
const datetimePicker = document.getElementById('datetime-picker');
const sortButton = document.querySelector('.sort-button');
const sortTrigger = document.querySelector('.sort-trigger');

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
            fetchMessages(startDate, endDate).then(() => {
                console.log('Messages filtered and loaded');
            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
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