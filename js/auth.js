async function Register() {
    event.preventDefault()
    const login = document.getElementById('regLogin').value
    const pass = document.getElementById('regPassword').value
    const fio = document.getElementById('regFio').value
    const phone = document.getElementById('regPhone').value
    const email = document.getElementById('regEmail').value

    if(!login || !pass || !fio || !phone || !email) {
        alert('Заполните все поля')
        return
    }

    const data = {
        login: login,
        pass: pass,
        fio: fio,
        phone: phone,
        email: email
    }

    try {
        const res = await fetch('https://kval-backend.onrender.com/reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        const result = await res.json()

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({
                users_id: result.data.id
            }))
            window.location.href = 'content.html'
        } else {
            alert(result.error)
        }
    }catch (error) {
        console.log(error)
        alert("ошибка с сервера")
    }
}

async function Login() {
    event.preventDefault()
    const login = document.getElementById('authLogin').value
    const pass = document.getElementById('authPassword').value

    if(!login || !pass) {
        alert('Заполните все поля')
        return
    }

    if (login === "Admin" || pass === "KorokNET") {

        window.location.href = 'admin.html'
    }

    const data = {
        login: login,
        pass: pass
    }

    try {
        const res = await fetch('https://kval-backend.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })

        const result = await res.json()

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({
                users_id: result.data.id
            }))
            window.location.href = 'content.html'
        } else {
            alert(result.error)
        }
    }catch (error) {
        console.log(error)
        alert("ошибка с сервера")
    }
}