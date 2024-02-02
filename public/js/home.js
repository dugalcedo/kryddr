const borders = {
    Slut: 'red',
    "Nästan slut": 'orange',
    Finns: 'green',
    "Finns mycket": 'cyan',
    '???': 'gray'
}

document.querySelectorAll('select[data-kid]').forEach(sel => {
    sel.addEventListener('change', async e => {
        const {kid, oid} = e.target.dataset
        const res = await fetch(
            `/api/kryddstatus`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    kid,
                    oid,
                    status: e.target.value
                })
            }
        )
        e.target.style.border = `2px solid ${borders[e.target.value]}`
    })
})

const loginForm = document.querySelector('#login')
if (loginForm) {
    loginForm.addEventListener('submit', async e => {
        e.preventDefault()
        const {username, password} = Object.fromEntries(new FormData(e.target))
        const res = await fetch(`/api/login?username=${username}&password=${password}`)
        const data = await res.json()
        if (data.error) {
            alert('misslyckades')
            return
        }
        document.cookie = `krydd-token=${data.token};Max-Age=${365*3600}`
        location.reload()
    })
}