import { APIError, APIResponder } from "../util"
import { UserResults, UserResultsRequest } from "../../shared/components"
import { getResults } from "../db"

//TODO: Write tests
const evaluate: APIResponder<UserResults> = async (req) => {
    const { score, asNew } = req.query as { score: "string", asNew: "string" }
    const scoreNum = Number.parseFloat(score)
    const asNewNum = Number.parseInt(score)

    if (isNaN(scoreNum) || isNaN(asNewNum)) {
        console.log(scoreNum, asNewNum, score, asNew)
        throw new APIError("Wrong requset type. Expected: {score: number, asNew?: boolean}", 400)
    }
    let res = await getResults(scoreNum)
    if (!asNewNum) {
        res.position -= 1
        res.total -= 1
    }
    return res
}
export default evaluate