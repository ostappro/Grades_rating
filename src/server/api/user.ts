import { prune } from "../../shared/util";
import { APIError, APIResponder } from "../util";
import { getUser } from "../db";
import { User } from "../../shared/components";

const user: APIResponder<User> = async (req) => {
    const { id, email, name } = req.query
    if (id == undefined && email == undefined && name == undefined) 
        throw new APIError("Request did not specify any of the following querries: id, email, name", 400)
    const user = await getUser(prune({ id, email, name }))
    if (!user) throw new APIError("Cannot find specified user", 404)
    return user
}
export default user