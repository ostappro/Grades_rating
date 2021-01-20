import { APIResponder, APIError } from "../util";
import { inShapeOf } from "../../shared/util";
import { UserSchema, User, GradeSchema, UserResults } from "../../shared/components";
import { putGrade, getResults } from "../db";

const put: APIResponder<UserResults> = async (req) => {
    console.log("put user ", req.body)
    if (!inShapeOf(req.body, UserSchema)) throw new APIError("Wrong user format. Expected {id: string, name: string, email: string, grades: Array}", 400)
    const { id, email, grades, name } = req.body as User
    grades.forEach((grade, idx) => {
        if (!inShapeOf(grade, GradeSchema))
            throw new APIError(`Wron grade format at index ${idx}. Expected {name: string, credits: number, optional: boolean, grade: number}`, 400)
    })
    const user = { id, email, grades, name }
    await putGrade(user)

    // 
    const weightedSum = user.grades.reduce((acc, cur) => acc + cur.credits * cur.grade, 0)
    const creditsSum = user.grades.reduce((acc, cur) => acc + cur.credits, 0)
    let res = await getResults(weightedSum / creditsSum)
    res.position -= 1
    res.total -= 1
    return res
}
export default put