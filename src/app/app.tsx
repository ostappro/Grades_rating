// import 'bootstrap'
import './scss/app.scss'
import ReactDOM from "react-dom"
import React from "react"
import { useSelector } from "react-redux"
import CompulsoryCourses from './components/CompulsoryCourses'
import OptionalCourses from './components/OptionalCourses'
import WelcomeBanner from "./components/WelcomeBanner"
import { store, withStore, OCState, filterValidGrades } from './components/store'
import Summary from './components/Summary'
import { account, getToken, getUserInfo } from './lib/auth'
import { Grade, User } from '../shared/components'
import { debounce, callOnUpdatedArgs } from "../shared/util"
import { evaluate, getUser, saveUser } from "./lib/api"

const submit = () => {
    const state = store.getState()
    if (!state.user.name) throw new Error("User does not have name yet")
    // if (!state.user.id) throw new Error("User does not have id yet")
    const grades = filterValidGrades(state.grades)

    const user: User = {
        email: state.user.name,
        name: state.user.name,
        id: state.user.name,
        grades
    }

    saveUser(user)
        .then(res => {
            store.dispatch({ type: "user", new: false })
            store.dispatch({ type: "results", total: res.total + 1, position: res.position + 2 })
        })
        .catch(console.error)
}

const requestEvaluation = debounce(
    callOnUpdatedArgs(
        (score: number) => {
            store.dispatch({ type: "results", loading: true })
            const asNew = store.getState().user.new
            evaluate({ score, asNew })
                .then(res =>
                    store.dispatch({ type: "results", loading: false, position: res.position, total: res.total }))
                .catch(console.error)
        }
    ), 500)

ReactDOM.render(
    withStore(store, WelcomeBanner, { specialty: "126", course: "3" }),
    document.getElementById("userinput-area-welcome-div"))
ReactDOM.render(
    withStore(store, CompulsoryCourses, {}),
    document.getElementById("compulsory-courses-div"))
ReactDOM.render(
    withStore(store, OptionalCourses, {}),
    document.getElementById("optional-courses-div"))
ReactDOM.render(
    withStore(store, Summary, { onConfirm: submit }),
    document.getElementById("submit-area-el"))

store.subscribe(() => {
    const grades = filterValidGrades(store.getState().grades)

    const weightedSum = grades.reduce((acc, cur) => acc + cur.credits * cur.grade, 0)
    const creditsSum = grades.reduce((acc, cur) => acc + cur.credits, 0)
    const weighted = weightedSum / creditsSum

    requestEvaluation(weighted)
})

const name = sessionStorage.getItem("username")
if (name) {
    store.dispatch({ type: "user", name })
    getUser({ name })
        .then(user => {
            store.dispatch({ type: "user", new: false })
            store.dispatch({ type: "grades", grades: user.grades })

            const weightedSum = user.grades.reduce((acc, cur) => acc + cur.credits * cur.grade, 0)
            const creditsSum = user.grades.reduce((acc, cur) => acc + cur.credits, 0)
            const weighted = weightedSum / creditsSum
            requestEvaluation(weighted || 0)
        })
        .catch(console.warn)
} else {
    window.location.pathname = "/login.html"
}

