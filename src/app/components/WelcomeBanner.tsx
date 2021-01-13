import React from "react"
import { useSelector } from "react-redux"
import { OCState } from "./store"

interface WelcomeBannerProps {
    specialty: string
    course: string
}
const WelcomeBanner: React.FC<WelcomeBannerProps> = props => {
    let name = useSelector<OCState, string | undefined>(state => state?.user?.name)

    return <>
        <h1 className="block">Вітаю, {name || "Завантаження..."}</h1>
        <div id="user-speciality-and-course-div">
            <span className="user-subinfo"><b>Спеціальність: </b>{props.specialty}</span>
            <span className="user-subinfo" id="year-of-study-span"><b>Курс: </b>{props.course}</span>
        </div>
    </>
}
export default WelcomeBanner