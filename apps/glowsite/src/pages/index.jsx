/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React, { useEffect, useState } from "react"
import { enquireScreen } from "enquire-js"

import Banner0 from "../antm/Banner0"
import Content5 from "../antm/Content5"
import Content3 from "../antm/Content3"

import { Banner01DataSource, Content00DataSource, Content30DataSource, Content50DataSource } from "../data/antmotion.data"

import "../less/antMotionStyle.less"
import { MdxFragment } from "../providers/MdxFragmentProvider"
import { HomeFeatures } from "../components/block/HomeFeatures"

let isMobile
enquireScreen(b => {
    isMobile = b
})

const { location = {} } = typeof window !== "undefined" ? window : {}

const Home = props => {
    const [mobile, setMobile] = useState(isMobile)
    const [show, setShow] = useState(!location.port)

    useEffect(() => {
        enquireScreen(b => {
            setMobile(!!b)
        })
        // dva 2.0 样式在组件渲染之后动态加载，导致滚动组件不生效；线上不影响；
        /* 如果不是 dva 2.0 请删除 start */
        if (location.port) {
            // 样式 build 时间在 200-300ms 之间;
            setTimeout(() => {
                setShow(true)
            }, 500)
        }
    }, [])

    return (
        <div className="templates-wrapper">
            {/* 如果不是 dva 2.0 替换成 {children} start */}
            {show && (
                <>
                    <Banner0 id="Banner0_1" key="Banner0_1" dataSource={Banner01DataSource} isMobile={mobile} />
                    <div className="glow-page-wrapper content0-wrapper">
                        <MdxFragment className="glow-page content0" name="frag1" />
                    </div>
                    <HomeFeatures />
                    {/*
                    <Content0 id="Content0_0" key="Content0_0" dataSource={Content00DataSource} isMobile={mobile} />
*/}
                    <Content5 id="Content5_0" key="Content5_0" dataSource={Content50DataSource} isMobile={mobile} />
                    <Content3 id="Content3_0" key="Content3_0" dataSource={Content30DataSource} isMobile={mobile} />
                </>
            )}
            {/* 如果不是 dva 2.0 替换成 {children} end */}
        </div>
    )
}

export default Home
