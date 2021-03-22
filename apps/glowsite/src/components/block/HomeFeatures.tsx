import React from "react"
import OverPack from "rc-scroll-anim/lib/ScrollOverPack"
import QueueAnim from "rc-queue-anim"
import { Col, Row } from "antd"
import {
    Html5Icon,
    EmbeddedIcon,
    StackIcon,
    BeautifulIcon,
    CoordinatedIcon,
    DrivesIcon,
    FieldbusIcon,
    GearsIcon,
    IndependenceIcon,
    IntegratedIcon,
    KnittingIcon,
    ModernIcon,
    OpenSourceIcon,
    RealTimeIcon,
    RecycleIcon,
    RoboticArmIcon,
    SoftwareDevIcon,
    TabletIcon,
    TrajectoryIcon
} from "../icons"

export const HomeFeature = ({ icon, title, content }) => {
    return (
        <Col md={8} xs={24}>
            <div className="content0-block">
                <div className="content0-block-icon glowbuzzer-icon">{icon}</div>
                <div className="content0-block-title">{title}</div>
                <div className="content0-block-content">{content}</div>
            </div>
        </Col>
    )
}

export const HomeFeatures = () => {
    const overPackProps = { playScale: 0.3, className: "" }

    return (
        <div className="glow-page-wrapper content0-wrapper">
            <div className="glow-page content0">
                <div className="title-wrapper">
                    <h1>Features</h1>
                </div>
                <OverPack {...overPackProps}>
                    <QueueAnim type="bottom" key="block" leaveReverse component={Row}>
                        <HomeFeature
                            key="web"
                            icon={<Html5Icon />}
                            title="Web stack"
                            content="Build complex machine control applications in a web stack - no proprietary languages or IDEs"
                        />
                        <HomeFeature
                            key="coordinated"
                            icon={<CoordinatedIcon />}
                            title="Co-ordinated motion"
                            content="Control robots and machines with complex kinematic configurations"
                        />
                        <HomeFeature
                            key="embedded"
                            icon={<EmbeddedIcon />}
                            title="Embedded"
                            content="Runs on a Linux or microcontroller platform making it easy to embed into your product"
                        />
                        <HomeFeature
                            key="realtime"
                            icon={<RealTimeIcon />}
                            title="Real-time"
                            content="Handle complex real-time machine control challenges in a software stack you are familiar with"
                        />
                        <HomeFeature
                            key="fieldbus"
                            icon={<FieldbusIcon />}
                            title="Fieldbus integration"
                            content="Integrates common fieldbusses (EtherCAT, PROFINET, Ethernet/IP and so on)"
                        />
                        <HomeFeature
                            key="drives"
                            icon={<DrivesIcon />}
                            title="Massive range of drives and I/O"
                            content="Work with huge variety of manufacturers drive and io products"
                        />
                        <HomeFeature
                            key="robot"
                            icon={<RoboticArmIcon />}
                            title="Solve challenging maching control problems"
                            content="Handles complex requirements, for example sensor guided real-time motion"
                        />
                        <HomeFeature
                            key="plc"
                            icon={<IntegratedIcon />}
                            title="PLC integration"
                            content="Integrates with PLCs from leading manufacturers - Codesys, Siemens, Allen Bradley, ABB, Omron..."
                        />
                        <HomeFeature
                            key="independence"
                            icon={<IndependenceIcon />}
                            title="Vendor independence"
                            content="Work with any hardware so you can mix and match to get the performance you want at the price point you need"
                        />
                        <HomeFeature
                            key="gears"
                            icon={<GearsIcon />}
                            title="Develop using technology you understand"
                            content="Use the tools and languages you want to develop, test and deploy your machine control – gey away from weird (legacy, proprietary) automation company tools"
                        />
                        <HomeFeature
                            key="opensource"
                            icon={<OpenSourceIcon />}
                            title="Leverage open-source"
                            content="Utilise the vast open-source community to easily and rapidly develop your product"
                        />
                    </QueueAnim>
                </OverPack>
            </div>
        </div>
    )
}
