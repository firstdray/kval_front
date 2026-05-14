let requests = {}

async function getRequest() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        const res = await fetch(`https://kval-backend.onrender.com/request?users_id=${user.users_id}`, {
            method: 'GET',
        });

        const result = await res.json()

        if (res.ok) {
            requests = result.data
            displayRequests(requests)
        }
    } catch (error) {
        console.log(error)
        alert("ошибка с сервера")
    }
}

function displayRequests(requests) {
    const tbody = document.getElementById('myTicketsBody')

    if (!requests || requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Нет заявок</td></tr>'
        return
    }

    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>${escapeHtml(request.name_course)}</td>
            <td>${request.end_date.split('T')[0]}</td>
            <td>${request.type_pay || 'Не указано'}</td>
            <td>${request.status || 'Новая'}</td>
            <td>${request.start_date.split('T')[0]}</td>
            <td>${request.review}</td>
        </tr>
    `).join('')
}

function updateSelect(requests) {
    const select = document.getElementById('otzyvKursId');

    // Запоминаем текущее выбранное значение
    const currentValue = select.value;

    // Очищаем select
    select.innerHTML = '<option value="">-- выберите заявку --</option>';

    // Фильтруем заявки без отзыва
    const availableRequests = requests.filter(req => !req.review || req.review === '');

    availableRequests.forEach(request => {
        const option = document.createElement('option');
        option.value = request.id;
        option.textContent = `${request.name_course}`;
        select.appendChild(option);
    });

    if (availableRequests.length === 0) {
        select.innerHTML = '<option value="">Нет заявок для отзыва</option>';
    }

    // Восстанавливаем выбранное значение если оно еще есть
    if (currentValue && [...select.options].some(opt => opt.value === currentValue)) {
        select.value = currentValue;
    }
}

document.getElementById('otzyvKursId').addEventListener('click', function() {
    updateSelect(requests)
});

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function newReview() {
    const select = document.getElementById('otzyvKursId');
    const name_course = select.options[select.selectedIndex]?.textContent;
    const review = document.getElementById('otzyvText').value;

    const user = JSON.parse(localStorage.getItem('user'))
    const users_id = user.users_id;

    const data = {
        users_id: users_id,
        name_course: name_course,
        review: review,
    }

    try {
        const res = await fetch('https://kval-backend.onrender.com/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await res.json()

        if (!res.ok) {
            alert(result.error)
        }
    }catch (error) {
        console.log(error)
        alert("ошибка с сервера")
    }
}

setInterval(getRequest, 3000)
