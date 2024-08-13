/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { Button, Flex, Input, Modal, Popconfirm, Select, Space } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { useUser, useUserModel } from "./UserProvider"
import { ADMIN_ROLE_NAME } from "./util"
import { UserChangePinModal } from "./UserChangePinModal"
import { useUserDatabase } from "./UserDatabaseProvider"

enum Mode {
    EDIT,
    ADD,
    CHANGE_PIN
}

export const UserManagementModal = ({ onClose }) => {
    const model = useUserModel()
    const { currentUser } = useUser()
    const { users, addUser, deleteUser, setRoles } = useUserDatabase()
    const [mode, setMode] = React.useState(Mode.EDIT)
    const [newUser, setNewUser] = React.useState({ username: "", password: "" })
    const [selectedUserId, setSelectedUserId] = useState(null)

    const user_select_list = users.map(user => ({ label: user._id, value: user._id }))
    const selectedUser = users.find(user => user._id === selectedUserId)
    const user_roles_list = selectedUser
        ? selectedUser.roles.map(role => ({
              label: role,
              value: role
          }))
        : []
    const self = currentUser._id === selectedUserId

    const possible_roles = model.roles.map(role => ({
        label: role.name,
        value: role.name
    }))

    async function add_user() {
        await addUser(newUser)
        setSelectedUserId(newUser.username)
        setMode(Mode.EDIT)
    }

    function update_roles(roles: string[]) {
        if (
            self &&
            currentUser.roles.includes(ADMIN_ROLE_NAME) &&
            !roles.includes(ADMIN_ROLE_NAME)
        ) {
            // don't allow an admin to remove the admin role from themselves!
            return
        }
        return setRoles(selectedUser, roles)
    }

    async function remove_user() {
        await deleteUser(selectedUser)
        setSelectedUserId(null)
    }

    if (mode === Mode.ADD) {
        return (
            <Modal open={true} onCancel={() => setMode(Mode.EDIT)} title="Add User" onOk={add_user}>
                <Space>
                    <Input
                        placeholder="Username"
                        value={newUser.username}
                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <Input
                        placeholder="PIN"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    />
                </Space>
            </Modal>
        )
    }

    if (mode === Mode.CHANGE_PIN) {
        return (
            <UserChangePinModal
                admin
                selectedUser={selectedUser}
                onClose={() => setMode(Mode.EDIT)}
            />
        )
    }

    return (
        <Modal
            open={true}
            onCancel={onClose}
            title="Manage Users"
            footer={[
                <Button key="add" onClick={() => setMode(Mode.ADD)} icon={<PlusOutlined />}>
                    Add User
                </Button>,
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            <Flex vertical gap={10}>
                <Space>
                    Select user to edit:
                    <Select
                        options={user_select_list}
                        value={selectedUserId}
                        onChange={setSelectedUserId}
                        placeholder="Select User"
                        popupMatchSelectWidth={false}
                        style={{ width: "100%" }}
                    />
                    <Popconfirm title={`Delete user ${selectedUserId}?`} onConfirm={remove_user}>
                        <Button disabled={self || !selectedUser} icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
                {selectedUserId && (
                    <>
                        Add or Remove Roles
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            onChange={update_roles as any /* type issue */}
                            value={user_roles_list}
                            options={possible_roles}
                        />
                        <div>
                            <Button onClick={() => setMode(Mode.CHANGE_PIN)}>Change PIN</Button>
                        </div>
                    </>
                )}
            </Flex>
        </Modal>
    )
}
