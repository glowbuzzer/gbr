import { EtherCatConfig } from "./EtherCatConfigTypes"

export function isMachineConfig(obj: any): obj is EtherCatConfig {
    console.log("Validating object:", obj)

    if (typeof obj !== "object" || obj === null) {
        console.error("Object is not valid:", obj)
        return false
    }

    if (typeof obj.machine_name !== "string") {
        console.error("Invalid machine_name:", obj.machine_name)
        return false
    }

    if (typeof obj.sub_machine_name !== "string") {
        console.error("Invalid sub_machine_name:", obj.sub_machine_name)
        return false
    }

    if (typeof obj.drives !== "object" || obj.drives === null) {
        console.error("Invalid drives:", obj.drives)
        return false
    }

    // if (typeof obj.drives.no_limits !== "boolean") {
    //     console.error(
    //         "Invalid drives.no_limits:",
    //         obj.drives.no_limits,
    //         `Type: ${typeof obj.drives.no_limits}`
    //     )
    //     return false
    // }
    console.log(obj.drives.no_limits)
    if (typeof obj.drives.no_limits !== "boolean") {
        console.error(
            "Invalid drives.no_limits:",
            obj.drives.no_limits,
            `Type: ${typeof obj.drives.no_limits}`
        )
        return false
    }

    if (!Array.isArray(obj.drives.limits)) {
        console.error("Invalid drives.limits:", obj.drives.limits)
        return false
    }

    for (let i = 0; i < obj.drives.limits.length; i++) {
        const limit = obj.drives.limits[i]
        if (typeof limit !== "object" || limit === null) {
            console.error(`Invalid drives.limits[${i}]:`, limit)
            return false
        }

        const keys = [
            "position_limit_max",
            "position_limit_min",
            "velocity_limit",
            "torque_limit",
            "max_motor_speed",
            "max_motor_torque"
        ]
        for (const key of keys) {
            if (typeof limit[key] !== "number") {
                console.error(
                    `Invalid drives.limits[${i}].${key}:`,
                    limit[key],
                    `Type: ${typeof limit[key]}`
                )
                return false
            }
        }
    }

    if (typeof obj.ethercat !== "object" || obj.ethercat === null) {
        console.error("Invalid ethercat:", obj.ethercat)
        return false
    }

    if (typeof obj.ethercat.ecm_cycle_shift !== "number") {
        console.error("Invalid ethercat.ecm_cycle_shift:", obj.ethercat.ecm_cycle_shift)
        return false
    }

    if (!Array.isArray(obj.ethercat.slaves)) {
        console.error("Invalid ethercat.slaves:", obj.ethercat.slaves)
        return false
    }

    for (let i = 0; i < obj.ethercat.slaves.length; i++) {
        const slave = obj.ethercat.slaves[i]
        if (typeof slave !== "object" || slave === null) {
            console.error(`Invalid ethercat.slaves[${i}]:`, slave)
            return false
        }

        if (typeof slave.name !== "string") {
            console.error(`Invalid ethercat.slaves[${i}].name:`, slave.name)
            return false
        }

        if (typeof slave.eep_name !== "string") {
            console.error(`Invalid ethercat.slaves[${i}].eep_name:`, slave.eep_name)
            return false
        }

        if (typeof slave.optional !== "object" || slave.optional === null) {
            console.error(`Invalid ethercat.slaves[${i}].optional:`, slave.optional)
            return false
        }

        if (typeof slave.optional.is_configurable !== "boolean") {
            console.error(
                `Invalid ethercat.slaves[${i}].optional.is_configurable:`,
                slave.optional.is_configurable
            )
            return false
        }

        if (typeof slave.optional.is_enabled !== "boolean") {
            console.error(
                `Invalid ethercat.slaves[${i}].optional.is_enabled:`,
                slave.optional.is_enabled
            )
            return false
        }

        if (!Array.isArray(slave.sdos)) {
            console.error(`Invalid ethercat.slaves[${i}].sdos:`, slave.sdos)
            return false
        }

        for (let j = 0; j < slave.sdos.length; j++) {
            const sdo = slave.sdos[j]
            if (typeof sdo !== "object" || sdo === null) {
                console.error(`Invalid ethercat.slaves[${i}].sdos[${j}]:`, sdo)
                return false
            }

            const sdoKeys = ["datatype", "index", "sub_index", "value", "length"]
            for (const key of sdoKeys) {
                if (typeof sdo[key] !== "number") {
                    console.error(
                        `Invalid ethercat.slaves[${i}].sdos[${j}].${key}:`,
                        sdo[key],
                        `Type: ${typeof sdo[key]}`
                    )
                    return false
                }
            }
        }
    }

    if (typeof obj.gbem !== "object" || obj.gbem === null) {
        console.error("Invalid gbem:", obj.gbem)
        return false
    }

    if (typeof obj.gbem.params !== "object" || obj.gbem.params === null) {
        console.error("Invalid gbem.params:", obj.gbem.params)
        return false
    }

    if (typeof obj.gbem.params.cycle_time !== "number") {
        console.error("Invalid gbem.params.cycle_time:", obj.gbem.params.cycle_time)
        return false
    }

    if (typeof obj.gbem.params.drive_state_change_timeout !== "number") {
        console.error(
            "Invalid gbem.params.drive_state_change_timeout:",
            obj.gbem.params.drive_state_change_timeout
        )
        return false
    }

    if (typeof obj.gbem.debug_params !== "object" || obj.gbem.debug_params === null) {
        console.error("Invalid gbem.debug_params:", obj.gbem.debug_params)
        return false
    }

    if (typeof obj.gbem.debug_params.disable_drive_warn_check !== "boolean") {
        console.error(
            "Invalid gbem.debug_params.disable_drive_warn_check:",
            obj.gbem.debug_params.disable_drive_warn_check
        )
        return false
    }

    if (typeof obj.gbem.debug_params.disable_drive_limit_check !== "boolean") {
        console.error(
            "Invalid gbem.debug_params.disable_drive_limit_check:",
            obj.gbem.debug_params.disable_drive_limit_check
        )
        return false
    }

    return true
}
