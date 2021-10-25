import React from "react"
import {Link} from "gatsby"
import {PlainImg} from "../components/PlainImg";

import Image404 from './404.png'

const NotFoundPage = () => {
return (
    <div>
        <h3>Robot says no</h3>
        <img src={Image404} alt="Robot saying no" height={"400px"}/>
    <p>
        <Link to="/">Head home</Link>
    </p>
    </div>
)
}

export default NotFoundPage
