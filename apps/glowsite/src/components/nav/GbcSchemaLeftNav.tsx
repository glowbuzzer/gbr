import { Link } from "gatsby"
import { StyledLeftNav } from "./StyledLeftNav"
import { Menu } from "antd"
import React from "react"
import { useGbcSchemaNav } from "./hooks"

export const GbcSchemaLeftNav = ({ current }) => {
    const groups = useGbcSchemaNav()

    return (
        <StyledLeftNav>
            <div className="title">Glowbuzzer Control Schema</div>
            <Menu mode="inline" selectedKeys={[current]}>
                <Menu.SubMenu key="enums" className={"capitalize"} title="Enums">
                    {groups.Enumeration.map(c => (
                        <Menu.Item key={c.name}>
                            <Link to={"/schema/" + c.name}>{c.name}</Link>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu key="types" className={"capitalize"} title="Types">
                    {groups["Type alias"].map(c => (
                        <Menu.Item key={c.name}>
                            <Link to={"/schema/" + c.name}>{c.name}</Link>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </Menu>
        </StyledLeftNav>
    )
}
