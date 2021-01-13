import { Schema } from "./util"

export interface Grade {
    name: string
    credits: number
    optional: boolean
    grade: number
}
export const GradeSchema = {
    name: String,
    credits: Number,
    optional: Boolean,
    grade: Number
}

export interface User {
    id: string
    name: string
    email: string
    grades: Grade[]
}
export const UserSchema: Schema = {
    id: String,
    name: String,
    email: String,
    grades: Array
}

export interface UserResults {
    position: number
    total: number
}

export interface UserResultsRequest {
    score: number
    asNew?: boolean
}
export const UserResultsRequestSchema: Schema = {
    scode: Number
}