import React, { useEffect, useState, useRef } from "react"
import Select from "react-select/creatable"
import { toCountNumber } from "../../shared/util"
import { OptionTypeBase } from "react-select"

interface CompolsoryCourseProps {
    name: string
    grade?: number
    onChange?: (grade: number) => void
}
export const CompolsoryCourse: React.FC<CompolsoryCourseProps> = ({ name, grade, onChange }) => {
    return <>
        <div className="course-name-span">{name}</div>
        <input
            className="form-control course-grade"
            value={grade}
            type="text"
            placeholder="Бали"
            onChange={(e) => {
                if (onChange) onChange(toCountNumber(e.target.value))
            }} />
    </>
}

interface OptionalCourseProps {
    name?: string
    grade?: number
    credits?: number
    options?: string[]
    onNameChange?: (name?: string) => void
    onCreditsChange?: (credits?: number) => void
    onGradeChange?: (grade?: number) => void
    onRemove?: () => void
}
export const OptionalCourse: React.FC<OptionalCourseProps> = props => {
    let [editable, setEditable] = useState(Boolean(props.name))
    let [focus, setFocus] = useState(false)
    let editRef = useRef<Select<{ value: string }>>(null)
    let nameRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const bool = Boolean(props.name) != editable
        if (bool != editable) setEditable(bool)
    }, [props.name])

    useEffect(() => {
        if (focus && editRef.current) {
            editRef.current.focus()
            setFocus(false)
        }
    }, [focus, editRef])

    const remaped = props.options ? props.options.map(value => ({ value, label: value })) : []
    let options = props.name ? [{ value: props.name, label: props.name }, ...remaped] : remaped

    return <>
        {editable
            ? <Select
                className="select"
                ref={editRef}
                options={options}
                value={props.name ? { value: props.name } : undefined}
                placeholder="Введіть назву дисципліни"
                onBlur={() => {
                    setEditable(false)
                }}
                onChange={(v: any) => {
                    console.log("change")
                    let val = v as OptionTypeBase | undefined | null
                    if (props.onNameChange) props.onNameChange(val?.value)
                    setEditable(false)
                }}
            />
            : <div className="optional-course-name course-name" onClick={() => {
                setEditable(true)
                setFocus(true)
            }} ref={nameRef}>{props.name}</div>}
            <input
                className="form-control course-grade"
                value={props.credits || ""}
                type="text"
                placeholder="Кредити"
                onChange={(e) => {
                    if (props.onCreditsChange) props.onCreditsChange(toCountNumber(e.target.value))
                }} />
            <input
                className="form-control course-grade"
                value={props.grade || ""}
                type="text"
                placeholder="Бали"
                onChange={(e) => {
                    if (props.onGradeChange) props.onGradeChange(toCountNumber(e.target.value))
                }} />
        <button className="btn remove-btn" onClick={() => { if (props.onRemove) props.onRemove() }} />
    </>
}