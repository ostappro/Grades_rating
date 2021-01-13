import http from "http";
import mongoose from "mongoose";
import { UserModel } from "../../src/server/models/user";
import { init } from "../../src/server/server";
import { get, post } from "request";

describe("mongo", () => {
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
    const putUser = {
        id: "id4", email: "mail4@mail.com", name: "user4", grades: [
            { grade: 40, credits: 4, name: "course", optional: false }
        ]
    }

    beforeEach(async () => {
        await UserModel.deleteMany({})
        await Promise.all([
            new UserModel(user1).save(),
            new UserModel(user2).save(),
            new UserModel(user3).save()
        ])
    })

    beforeAll(async () => {
        await init()
    })

    test("put", () => {
        post(`http://localhost:${process.env.PORT}/api/put`, {
            json: putUser
        }, async (err, _, body) => {
            expect(err).toBeFalsy()
            expect(body).toMatchObject({ position: 4, total: 4 })
            const user = await UserModel.findOne({ id: "id4" })
            expect(user?.toObject()).toMatchObject(user4)
        })
    })

    test("user", async () => {
        get(`http://localhost:${process.env.PORT}/api/user?id=id`, (err, res, body) => {
            expect(err).toBeFalsy()
            expect(body).toMatchObject(user1)
        })
        get(`http://localhost:${process.env.PORT}/api/user?email=${encodeURIComponent("email2@email.com")}`, (err, res) => {
            expect(err).toBeFalsy()
            expect(res).toMatchObject(user2)
            console.log(res)
        })
        get(`http://localhost:${process.env.PORT}/api/user?email=${encodeURIComponent("email2@email.com")}`, (err, res) => {
            expect(err).toBeFalsy()
            expect(res).toHaveProperty("errror")
        })
        await UserModel.deleteOne({ id: "id" })
        get(`http://localhost:${process.env.PORT}/api/user?id=id`, (err, res) => {
            expect(err).toBeFalsy()
            expect(res).toHaveProperty("error")
        })
    })

})