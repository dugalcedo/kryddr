const nyKatBtn = document.querySelector('#nykategori')
const katSel = document.querySelector('select')
const kats = [...katSel.children].map(({innerText}) => innerText.trim().toLowerCase())

nyKatBtn.addEventListener('click', e => {
    const namn = prompt('ange kategorins namn')
    if (!namn) {
        alert("namn måste finnas")
        return
    }
    if (kats.includes(namn.trim().toLowerCase())) {
        alert("namn finns redan")
        return
    }

    const nyOpt = document.createElement('option')
    nyOpt.value = namn
    nyOpt.innerText = namn
    katSel.append(nyOpt)
    nyOpt.setAttribute('selected', 'selected')
})

const form = document.querySelector('#add')
form.addEventListener('submit', async e => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target))
    if (!formData.objektnamn) {
        alert("vara namn måste finnas")
        return
    }

    const res = await fetch(`/api/add?namn=${formData.objektnamn}&kid=${formData.kid}`)
    const data = await res.json()
    console.log(data)
})