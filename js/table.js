const messagesTable = document.getElementById('messages-table');
const tbody = messagesTable.querySelector('tbody');

// Загрузка данных с сервера и отображение их в таблице
async function fetchMessages(startDate = null, endDate = null) {
    const url = 'http://127.0.0.1:8000/api/messages';
    const json = {
        datetime_start: startDate,
        datetime_stop: endDate
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        displayMessages(data);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages) {
    tbody.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных

    messages.forEach(message => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${message.date}</td>
            <td>${message.sender}</td>
            <td>${message.recipient}</td>
            <td>${message.ip}</td>
            <td>${message.size}</td>
            <td>${message.passed}</td>
            <td>${message.date}</td>
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