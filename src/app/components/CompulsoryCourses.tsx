import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch } from "redux"
import { CompolsoryCourse } from "./input"
import { OCAction, OCState } from "./store"

type ONum = number | undefined
type CompGrades = [ONum, ONum, ONum]

enum Compulsories {
    DO = "Дослідження операцій",
    PP = "Процедурне програмування на мовах С/С++",
    E = "Англійська мова"
}

interface CallbackReq {
    name: string
    credits: number
    optional?: boolean
    dispatch: Dispatch<OCAction>
}
type genCourseType = (params: CallbackReq) => (grade: number) => void
const genCourseCallback: genCourseType =
    ({ name, credits, optional = false, dispatch }) =>
        grade =>
            dispatch({ type: "set", name, grade, credits, optional })

const CompulsoryCourses: React.FC = () => {
    let [doGrade, ppGrade, eGrade] = useSelector<OCState, CompGrades>(state => {
        let res: CompGrades = [undefined, undefined, undefined]
        if (state && state.grades) state.grades.forEach(grade => {
            switch (grade.name) {
                case Compulsories.DO:
                    res[0] = grade.grade
                    break
                case Compulsories.PP:
                    res[1] = grade.grade
                    break
                case Compulsories.E:
                    res[2] = grade.grade
                    break
            }
        })
        return res
    })
    let dispatch = useDispatch<Dispatch<OCAction>>()

    const doChange = genCourseCallback({ name: Compulsories.DO, credits: 7, dispatch })
    const ppChange = genCourseCallback({ name: Compulsories.PP, credits: 5, dispatch })
    const eChange = genCourseCallback({ name: Compulsories.E, credits: 3.5, dispatch })

    return <>
        <CompolsoryCourse
            name={Compulsories.DO}
            grade={doGrade}
            onChange={doChange} />
        <CompolsoryCourse
            name={Compulsories.PP}
            grade={ppGrade}
            onChange={ppChange} />
        <CompolsoryCourse
            name={Compulsories.E}
            grade={eGrade}
            onChange={eChange} />
    </>
}
export default CompulsoryCourses