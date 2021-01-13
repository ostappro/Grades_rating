import React from "react"
import { useSelector } from "react-redux"
import { Grade } from "../../shared/components"
import { OCResults, OCState, filterValidGrades } from "./store"

const Summary: React.FC<{ onConfirm?: () => void }> = ({ onConfirm }) => {
    let grades = useSelector<OCState, Grade[]>(state =>
        state && state.grades && filterValidGrades(state.grades))
    let { position, total, loading } = useSelector<OCState, OCResults>(state => state?.results)
    const isUserNew = useSelector<OCState, boolean>(state => state?.user.new)

    const weightedSum = grades.reduce((acc, cur) => acc + cur.credits * cur.grade, 0)
    const creditsSum = grades.reduce((acc, cur) => acc + cur.credits, 0)

    if (!isUserNew) {
        position--;
        total--;
    }

    return <>
        <div className="grading-stat">
            <b>Зважений бал:</b> {creditsSum ? (weightedSum / creditsSum).toFixed(2) : 0}
        </div>
        <div className="grading-stat">
            <b>Місце в рейтингу:</b> {position}/{total} {loading ? "..." : ""}
        </div>
        <div className="grading-stat">
            <b>Усього кредитів:</b> {creditsSum}
        </div>
        <div id="grading-disclaimer-div">
            Оскільки оцінки за предмети не можуть бути офіційно підтверджені, тому, будь ласка, подавайте коректну інформацію
        </div>
        <button className="btn btn-light confirm-eval-btn" onClick={onConfirm}>
            Пітвердити оцінку
        </button>
    </>
}
export default Summary