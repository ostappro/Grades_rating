import React from "react"
import { createStore, Reducer, Store, AnyAction, combineReducers } from "redux"
import { Provider } from "react-redux"
import { Grade } from "../../shared/components"

export interface OCGrade {
    name: string
    grade?: number
    credits?: number
    optional?: boolean
}

export interface OCUser {
    name?: string
    id?: string
    new: boolean
}

export interface OCResults {
    total: number
    position: number
    loading: boolean
}

export interface OCState {
    grades: OCGrade[]
    user: OCUser
    results: OCResults
}

export interface OCAction {
    type: "set" | "remove" | "user" | "results" | "grades"
    name?: string
    grade?: number
    credits?: number
    optional?: boolean
    user?: OCUser
    newName?: string
    total?: number
    position?: number
    id?: string
    loading?: boolean
    new?: boolean
    grades?: OCGrade[]
}

export interface OCGradeAction {
    type: "set" | "remove" | "grades"
    name?: string
    grade?: number
    credits?: number
    optional?: boolean
    newName?: string
    grades?: OCGrade[]
}

export interface OCUserAction {
    type: "user"
    name?: string
    id?: string
    new?: boolean
}

export interface OCResultsAction {
    type: "results"
    position?: number
    total?: number
    loading?: boolean
}

/**
 * Function that takes previous state, action and produces new state (reducer)
 * Reducer for grades
 * @param state previous grades state
 * @param action grades action to apply to transform state
 */
const gradeReducer: Reducer<OCGrade[], OCGradeAction> = (state = [], action) => {
    let idx: number | undefined
    switch (action.type) {
        case "set":
            if (idx === undefined) idx = state.findIndex(grade => grade.name == action.name)
            if (!action.name) throw new Error("Canot set grade with name set as undefined")
            if (idx === -1) return [
                ...state,
                {
                    name: action.newName || action.name,
                    credits: action.credits,
                    grade: action.grade,
                    optional: action.optional
                }
            ]
            state[idx].credits = action.credits
            state[idx].grade = action.grade
            if (action.newName) state[idx].name = action.newName
            return [...state]
        case "remove":
            return state.filter(grade => grade.name !== action.name)
        case "grades":
            return action.grades || []
        default:
            return state!
    }
}

/**
 * Reducer for user
 * @param state previous user state
 * @param action user action to transform state
 */
const userReducer: Reducer<OCUser, OCUserAction> = (state = { new: true }, action) => {
    if (action.type === "user") {
        let newSate = { ...state }
        if ("name" in action) newSate.name = action.name
        if ("id" in action) newSate.id = action.id
        if (action.new !== undefined) newSate.new = action.new
        return newSate
    }
    return state
}

/**
 * Reducer for user results
 * @param state previous state of user results
 * @param action results action to transform state
 */
const resultsReducer: Reducer<OCResults, OCResultsAction> = (state = { position: 0, total: 0, loading: false }, action) => {
    if (action.type === "results") {
        let newState = { ...state }
        if (action.position !== undefined) newState.position = action.position
        if (action.total !== undefined) newState.total = action.total
        if (action.loading !== undefined) newState.loading = action.loading
        return newState
    }
    return state
}

/**
 * Redux store for state combinig user, results and grade states and their respective reducers
 */
export const store = createStore(combineReducers({
    grades: gradeReducer,
    user: userReducer,
    results: resultsReducer
}), { grades: [], user: { new: true }, results: { total: 0, position: 0, loading: false } }, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

/**
 * Wraps react component inside react-redux store provider
 * @param store store to be accessible inside component tree
 * @param Component component to be wrapped within
 * @param props props to initalize components with
 */
export function withStore<P = {}, S = any, A extends AnyAction = AnyAction>(store: Store<S, A>, Component: React.ComponentType<P>, props: P) {
    return <Provider store={store}>
        <Component {...props} />
    </Provider>
}

export function filterValidGrades(grades: OCGrade[]): Grade[] {
    return grades.filter(grade =>
        grade.credits !== undefined &&
        grade.grade !== undefined &&
        grade.optional !== undefined) as any || []
}