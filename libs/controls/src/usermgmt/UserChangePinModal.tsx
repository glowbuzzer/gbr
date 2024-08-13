/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { Modal } from "antd"
import { UserProfile } from "./types"
import { UserPasswordKeypad } from "./UserPasswordKeypad"
import { hashPassword } from "./UserLoginModal"
import { useUser } from "./UserProvider"
import { useUserDatabase } from "./UserDatabaseProvider"

enum Mode {
    VALIDATE_CURRENT,
    ENTER_NEW,
    CONFIRM_NEW
}

type UserChangePinModalProps = {
    admin?: boolean
    selectedUser: UserProfile
    onClose(): void
}

export const UserChangePinModal = ({ selectedUser, admin, onClose }: UserChangePinModalProps) => {
    const { currentUser } = useUser()
    const { setPassword } = useUserDatabase()
    const [mode, setMode] = useState(Mode.VALIDATE_CURRENT)
    const [newPin, setNewPin] = useState(null)

    function mode_switch() {
        switch (mode) {
            case Mode.VALIDATE_CURRENT:
                return {
                    prompt: "Enter your PIN to verify your identity",
                    onValidate: async function (password: string) {
                        const hashed = await hashPassword(password)
                        const valid = hashed === currentUser.password
                        if (valid) {
                            setMode(Mode.ENTER_NEW)
                        }
                        return valid
                    }
                }
            case Mode.ENTER_NEW:
                return {
                    prompt: "Enter new PIN",
                    async onValidate(pin) {
                        setNewPin(pin)
                        setMode(Mode.CONFIRM_NEW)
                        return true
                    }
                }
            case Mode.CONFIRM_NEW:
                return {
                    prompt: "Re-enter new PIN",
                    async onValidate(pin) {
                        if (pin === newPin) {
                            await setPassword(selectedUser, pin)
                            onClose()
                            return true
                        }
                        return false
                    }
                }
        }
    }

    const props = mode_switch()
    return (
        <Modal open={true} onCancel={onClose} footer={[]}>
            <UserPasswordKeypad {...props} />
        </Modal>
    )
}
