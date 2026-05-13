async function newRequest() {
    const name_course = document.getElementById('kursName').value;
    const start_date = document.getElementById('kursDate').value;
    const type_pay = document.getElementById('sposobOplaty').value;

    const date = new Date(start_date)
    date.setDate(date.getDate() + 30)

    const end_date = date.toISOString().split('T')[0]

    const user = JSON.parse(localStorage.getItem('user'))
    const users_id = user.users_id;

    const data = {
        users_id: users_id,
        name_course: name_course,
        start_date: start_date,
        type_pay: type_pay,
        end_date: end_date,
    };

    try {
        const res = await fetch('https://kval-backend.onrender.com/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await res.json()

        if (res.ok) {
            window.location.href = 'content.html'
        } else {
            alert(result.error)
        }
    } catch (error) {
        console.log(error)
        alert("ошибка с сервера")
    }
}