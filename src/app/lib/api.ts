import { User, UserResults, UserResultsRequest } from "../../shared/components"
import qs from "qs"

export function wrapAPIError<T = any>(val: any): T {
    if (val.error) throw new Error(val.error)
    return val
}

interface UserReq {
    id?: string
    name?: string
    email?: string
}
/**
 * Get user session from db.
 * If provided with string: used as id of the user
 * If provided with object: propeties of such are used as query params.
 *                          If nothing is specified, expect error from api
 * @param req either a string (user id) or a object specifying query params
 * @returns promise to a user object, which can be rejected with an error from api or network layer
 * 
 * @todo //TODO: Write tests
 */
export function getUser(req: string | UserReq): Promise<User> {
    if (typeof req !== "string") req = qs.stringify(req)
    else req = `id=${req}`
    return fetch(`/api/user?${req}`)
        .then(r => r.json())
        .then(wrapAPIError)
}

/**
 * Saves user to a server
 * @param user user session to be saved
 * @returns promise to user results of being positioned inside the table
 * 
 * @todo //TODO: Write tests
 */
export function saveUser(user: User): Promise<UserResults> {
    return fetch("/api/put", { 
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(r => r.json())
        .then(wrapAPIError)
}

/**
 * Evaluates given score against database
 * @param param0 score to be tested, and whether result should be in format as if tested value is a new entry
 * @returns promise to user results
 * 
 * @todo //TODO: Write tests
 */
export function evaluate({score, asNew = true}: UserResultsRequest): Promise<UserResults> {
    return fetch(`/api/evaluate?score=${score}&asNew=${asNew ? 1 : 0}`)
        .then(r => r.json())
        .then(wrapAPIError)
}