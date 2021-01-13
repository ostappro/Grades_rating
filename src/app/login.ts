import './scss/login-form.scss'

const form = document.getElementById("form")!
const input: HTMLInputElement = document.getElementById("input") as any
form.onsubmit = (e) => {
    e.preventDefault()
    sessionStorage.setItem("username", input.value)
    window.location.pathname = "/app.html"
}
