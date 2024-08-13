/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { UserPasswordKeypad } from "./UserPasswordKeypad"
import { Button, Empty, Flex, Modal, Select } from "antd"
import { UserProfile } from "./types"
import { useUserDatabase } from "./UserDatabaseProvider"
import { ArrowLeftOutlined } from "@ant-design/icons"
import styled from "styled-components"

export async function hashPassword(password: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

const StyledModal = styled(Modal)`
    .ant-modal-body {
        text-align: center;
        padding: 30px 0;
    }
`

type UserLoginPanelProps = {
    onLogin: (user: UserProfile) => void
    onCancel?: () => void
}

export const UserLoginModal = ({ onLogin, onCancel }: UserLoginPanelProps) => {
    const { users } = useUserDatabase()
    const [selectedUserId, setSelectedUserId] = useState(null)

    async function validate_password(password: string) {
        const user = users.find(user => user._id === selectedUserId)
        if (!user) {
            throw new Error("Invalid user, not found in list of users: " + selectedUserId)
        }
        const hashed = await hashPassword(password)
        if (hashed === user.password) {
            onLogin(user)
            return true
        }
        return false
    }

    if (!selectedUserId) {
        const options = users.map(user => ({ label: user._id, value: user._id }))
        return (
            <StyledModal
                style={{ textAlign: "center" }}
                open
                closable={!!onCancel}
                footer={[
                    onCancel && (
                        <Button key="cancel" onClick={onCancel}>
                            Cancel
                        </Button>
                    )
                ].filter(Boolean)}
                onCancel={onCancel}
            >
                <p>Log In</p>
                <Select
                    options={options}
                    showSearch
                    popupMatchSelectWidth={false}
                    placeholder="Select user account"
                    notFoundContent={
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No matching user found"
                        />
                    }
                    onChange={setSelectedUserId}
                />
            </StyledModal>
        )
    }

    function unselect_user() {
        return setSelectedUserId(null)
    }

    return (
        <Modal
            open
            footer={[
                <Button key="back" onClick={unselect_user} icon={<ArrowLeftOutlined />}>
                    Change User
                </Button>
            ]}
            onCancel={unselect_user}
        >
            <p>Log in as {selectedUserId}</p>
            <UserPasswordKeypad onValidate={validate_password} />
        </Modal>
    )
}
