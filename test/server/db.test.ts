import mongoose from "mongoose";
import { getResults, getUser, putGrade } from "../../src/server/db";
import { UserModel } from "../../src/server/models/user";

describe("mongo", () => {
    beforeEach(() => {
        return UserModel.deleteMany({})
    })

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    })

    const user1 = {
        id: "id", name: "name", email: "mail@mail.com", grades: [
            { credits: 4, grade: 96, name: "course", optional: false }
        ], weighted: 96
    }
    const user2 = {
        id: "id2", email: "mail2@mail.com", name: "user2", grades: [
            user1.grades[0],
            { grade: 81, credits: 5, name: "course2", optional: false }
        ], weighted: 87.66666667
    }
    const user3 = {
        id: "id3", email: "mail3@mail.com", name: "user3", grades: [
            { grade: 91, credits: 5, name: "course2", optional: false },
            { grade: 100, credits: 10, name: "course3", optional: true }
        ], weighted: 97
    }
    const user4 = {
        id: "id4", email: "mail4@mail.com", name: "user4", grades: [
            { grade: 40, credits: 4, name: "course", optional: false }
        ], weighted: 40
    }

    test("putGrade", async () => {
        await putGrade(user1)
        const user = await UserModel.findOne({ id: "id" })
        expect(user?.toObject()).toMatchObject(user1)
    })

    test("getResults", async () => {
        await Promise.all([
            new UserModel(user1),
            new UserModel(user2),
            new UserModel(user3)
        ].map(doc => doc.save()))

        expect(await getResults(100)).toMatchObject({
            position: 1,
            total: 4
        })
        expect(await getResults(50)).toMatchObject({
            position: 4,
            total: 4
        })
        await (new UserModel(user4)).save()
        expect(await getResults(50)).toMatchObject({
            position: 4,
            total: 5
        })
    })

    test("getUser", async () => {
        await new UserModel(user1).save()
        await new UserModel(user2).save()

        expect(await getUser({ id: "id" })).toMatchObject(user1)
        expect(await getUser({ id: "ID" })).toBeNull()
        expect(await getUser({ email: "mail2@mail.com" })).toMatchObject(user2)
    })
})