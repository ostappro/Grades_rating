import React, { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { OptionTypeBase } from "react-select"
import Select from "react-select/creatable"
import { toCountNumber } from "../../shared/util"
import { OCGrade, OCState } from "./store"
import { OptionalCourse } from "./input"

const OptionalCourses: React.FC = () => {
    let state = useSelector<OCState, OCGrade[]>(state => state && state.grades && state.grades.filter(grade => grade.optional) || [])
    let dispatch = useDispatch()

    let [optionalCredits, setOptionalCredits] = useState<number | "">("")
    let [optionalGrade, setOptionalGrade] = useState<number | "">("")
    let selectRef = useRef<Select<{ value: string }>>(null)

    return <>
        {state.map(({ name, grade, credits }) =>
            <OptionalCourse
                name={name}
                grade={grade}
                credits={credits}
                key={name}
                onNameChange={newName => {
                    dispatch({ type: "set", name, newName, grade, credits })
                }}
                onCreditsChange={credits => {
                    dispatch({ type: "set", name, credits, grade })
                }}
                onGradeChange={grade => {
                    dispatch({ type: "set", name, grade, credits })
                }}
                onRemove={() => {
                    dispatch({ type: "remove", name })
                }}
            />
        )}
        <Select className="select" value={{ value: "" }} placehoder="Введіть назву дисципліни" ref={selectRef} options={[{value: "Python", label: "Python"}]} onChange={(v: any) => {
            const val = v as OptionTypeBase | undefined | null
            if (val) {
                dispatch({ type: "set", name: val.value, grade: optionalGrade || undefined, credits: optionalCredits || undefined, optional: true})
                setOptionalCredits("")
                setOptionalGrade("")
            }
        }} />
        <input
            className="form-control course-grade"
            type="text"
            placeholder="Кредити"
            value={optionalCredits}
            onChange={(e) => {
                setOptionalCredits(toCountNumber(e.target.value))
            }}
        />
        <input
            className="form-control course-grade"
            type="text"
            placeholder="Бали"
            value={optionalGrade}
            onChange={(e) => {
                setOptionalGrade(toCountNumber(e.target.value))
            }}
        />
    </>
}
export default OptionalCourses