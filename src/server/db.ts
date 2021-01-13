import { User, UserResults } from "../shared/components"
import { UserModel } from "./models/user"

/**
 * Puts or updates existing user in db with one provided
 * @async
 * @param user User object served as a request to put him in db
 * @param connection Promise to a mongoose connention. Defaults to database specified in .env
 * @returns promise to a newly saved document
 * 
 */
export async function putGrade(user: User) {
    const weightedSum = user.grades.reduce((acc, cur) => acc + cur.credits * cur.grade, 0)
    const creditsSum = user.grades.reduce((acc, cur) => acc + cur.credits, 0)
    let oldUser = await UserModel.findOne({ id: user.id })
    if (oldUser) {
        Object.assign(oldUser, { grades: user.grades, weighted: weightedSum / creditsSum })
        return oldUser.save()
    } else {
        let model = new UserModel({
            ...user,
            weighted: weightedSum / creditsSum
        })
        return model.save()
    }
}

/**
 * Finds where specified score should be placed inside the db
 * //TODO: Do not iterate through every entry in db upon request. At least use binary search.
 * @async
 * @param score score to be evaluated with
 * @returns promise to a result of a query
 * 
 */
export async function getResults(score: number): Promise<UserResults> {
    let position = 1
    const arr = await UserModel.find().select("weighted")
    arr.map(arr => arr.toObject())
        .forEach(doc => {
            if (doc.weighted && doc.weighted > score) position++
        })
    return {position, total: arr.length + 1}
}

/**
 * Just find user 4head
 * @async
 * @param querry mongodb querry params to extract user
 * @returns promise to a user in case it can be found. `null` otherwise
 * 
 */
export async function getUser(querry: any) : Promise<User | null> {
    const doc = await UserModel.findOne(querry)
    return doc ? doc.toObject() : null;
}