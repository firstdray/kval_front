// Функция создания модального окна
function buildModal() {
    // Контейнер
    const modal = document.createElement('div');
    modal.id = 'statusModal';
    modal.className = 'modal-overlay';

    // Окно
    const modalWindow = document.createElement('div');
    modalWindow.className = 'modal-window';

    // Шапка
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const heading = document.createElement('h3');
    heading.textContent = 'Изменение статуса заявки';

    const closeSpan = document.createElement('span');
    closeSpan.className = 'modal-close';
    closeSpan.id = 'closeStatusModal';
    closeSpan.innerHTML = '&times;';

    modalHeader.appendChild(heading);
    modalHeader.appendChild(closeSpan);

    // Тело
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    const form = document.createElement('form');
    form.id = 'statusChangeForm';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'statusZayavkaId';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const label = document.createElement('label');
    label.textContent = 'Новый статус';

    const select = document.createElement('select');
    select.id = 'newStatusSelect';

    const options = [
        { value: 'new', text: 'Новая' },
        { value: 'learning', text: 'Идет обучение' },
        { value: 'finished', text: 'Обучение завершено' }
    ];
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        select.appendChild(option);
    });

    inputGroup.appendChild(label);
    inputGroup.appendChild(select);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'form-buttons';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn-primary';
    submitBtn.onclick = updateStatus;
    submitBtn.textContent = 'Сохранить';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-danger';
    cancelBtn.id = 'cancelStatusBtn';
    cancelBtn.textContent = 'Отмена';

    btnContainer.appendChild(submitBtn);
    btnContainer.appendChild(cancelBtn);

    form.appendChild(hiddenInput);
    form.appendChild(inputGroup);
    form.appendChild(btnContainer);
    modalBody.appendChild(form);
    modalWindow.appendChild(modalHeader);
    modalWindow.appendChild(modalBody);
    modal.appendChild(modalWindow);

    document.body.appendChild(modal);
    return modal;
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const modal = buildModal();
    const closeBtn = document.getElementById('closeStatusModal');
    const cancelBtn = document.getElementById('cancelStatusBtn');
    const form = document.getElementById('statusChangeForm');
    const hiddenId = document.getElementById('statusZayavkaId');

    function closeModal() {
        modal.style.display = 'none';
        if (form) form.reset();
    }

    // Закрытие
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    const triggerBtn = document.getElementById('rt');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', function() {
            // Получаем ID заявки (из data-атрибута или другого места)
            let zayavkaId = this.getAttribute('data-zayavka-id');
            if (!zayavkaId) {
                zayavkaId = prompt('Введите ID заявки');
                if (!zayavkaId) return;
            }
            hiddenId.value = zayavkaId;
            modal.style.display = 'flex';
            const select = document.getElementById('newStatusSelect');
            if (select) select.focus();
        });
    }
});

async function getRequestAll() {
    try {
        const res = await fetch(`https://kval-backend.onrender.com/request/all`, {
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

document.getElementById('adminTable').addEventListener('click', function(e) {
    // Проверяем, что кликнули по кнопке с id="rt"
    if (e.target && e.target.id === 'rt') {
        const zayavkaId = e.target.getAttribute('data-zayavka-id');
        const modal = document.getElementById('statusModal');
        const hiddenId = document.getElementById('statusZayavkaId');

        if (modal && hiddenId) {
            hiddenId.value = zayavkaId;
            modal.style.display = 'flex';
        }
    }
})

function displayRequests(requests) {
    const tbody = document.getElementById('adminTableBody')

    if (!requests || requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Нет заявок</td></tr>'
        return
    }

    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>${request.id}</td>
            <td>${request.users_id}</td>
            <td >${escapeHtml(request.name_course)}</td>
            <td>${request.end_date.split('T')[0]}</td>
            <td>${request.type_pay}</td>
            <td><button id="rt" class="btn-status" data-course="${escapeHtml(request.name_course)}" data-zayavka-id="${request.id}">${request.status}</button></td>
            <td>${request.start_date.split('T')[0]}</td>
        </tr>
    `).join('')

    document.querySelectorAll('.btn-status').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status');

            const modal = document.getElementById('statusModal');
            const hiddenId = document.getElementById('statusZayavkaId');
            const statusSelect = document.getElementById('newStatusSelect');

            if (modal && hiddenId && statusSelect) {
                hiddenId.value = requestId;

                for (let i = 0; i < statusSelect.options.length; i++) {
                    if (statusSelect.options[i].value === currentStatus) {
                        statusSelect.selectedIndex = i;
                        break;
                    }
                }

                modal.style.display = 'flex';
            }
        });
    });
}

async function updateStatus() {
    const select = document.getElementById('newStatusSelect');
    const status = select.options[select.selectedIndex]?.textContent;
    const user = JSON.parse(localStorage.getItem('user'))
    const users_id = user.users_id;
    const button = document.getElementById('rt');
    const name_course = button.getAttribute('data-course');

    const data = {
        users_id: parseInt(users_id),
        name_course: name_course,
        status: status
    }

    try {
        const res = await fetch('https://kval-backend.onrender.com/request/status', {
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
    } catch (error) {
        console.log(error)
        alert("ошибка с сервера")
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

setInterval(getRequestAll, 3000)
