/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useUser } from "./index"
import { Dropdown, Space } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { MenuItemType } from "antd/es/menu/hooks/useItems"
import { UserManagementCapability } from "./capabilities"
import { UserManagementModal } from "./UserManagementModal"
import { UserChangePinModal } from "./UserChangePinModal"

type EnhancedMenuItem = MenuItemType & { capability?: symbol | symbol[] }

export const StatusBarUser = () => {
    const { currentUser, capabilities, logout, showAnonymousLogin } = useUser()
    const [showUserMgmt, setShowUserMgmt] = React.useState(false)
    const [showChangePin, setShowChangePin] = React.useState(false)

    const show_usermgmt = () => {
        setShowUserMgmt(true)
    }

    function filter_by_capability(item: EnhancedMenuItem) {
        if (!item.capability) {
            return true
        }
        if (Array.isArray(item.capability)) {
            return item.capability.some(c => capabilities.includes(c))
        }
        return capabilities.includes(item.capability)
    }

    function remove_capability(item: EnhancedMenuItem) {
        const { capability, ...rest } = item
        return rest
    }

    function change_pin() {
        setShowChangePin(true)
    }

    const items: EnhancedMenuItem[] = currentUser
        ? [
              {
                  key: "usermgmt",
                  label: "Manage Users",
                  onClick: show_usermgmt,
                  capability: UserManagementCapability.ALL
              },
              {
                  key: "pin",
                  label: "Change PIN",
                  onClick: change_pin
              },
              {
                  key: "logout",
                  label: "Log Out",
                  onClick: logout
              }
          ]
              .filter(filter_by_capability)
              .map(remove_capability)
        : [
              {
                  key: "login",
                  label: "Log In",
                  onClick: showAnonymousLogin
              }
          ]

    return (
        <>
            {showUserMgmt && <UserManagementModal onClose={() => setShowUserMgmt(false)} />}
            {showChangePin && (
                <UserChangePinModal
                    selectedUser={currentUser}
                    onClose={() => setShowChangePin(false)}
                />
            )}
            <Dropdown menu={{ items }}>
                <Space>
                    {currentUser?._id}
                    <UserOutlined />
                </Space>
            </Dropdown>
        </>
    )
}
