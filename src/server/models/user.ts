import { Schema, model } from "mongoose";

export const GradeSchema = new Schema({
    name: String,
    credits: {
        type: Number,
        min: 2,
        max: 12
    },
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    optional: Boolean
})

export const UserSchema = new Schema({
    id: String,
    name: String,
    email: String,
    weighted: Number,
    grades: [GradeSchema]
})

export const UserModel = model("user", UserSchema)