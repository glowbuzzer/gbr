// EtherCatConfigContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react"
import { message } from "antd"
import { EtherCatConfig, exampleConfig } from "./EtherCatConfigTypes"
import { useConnection } from "@glowbuzzer/store"
import { isMachineConfig } from "./isEtherCatConfig"
import { initialTabList } from "./EtherCatConfigTab"

type EtherCatConfigContextType = {
    config: EtherCatConfig | null
    editedConfig: EtherCatConfig | null
    setConfig: (config: EtherCatConfig) => void // Function to set the current configuration
    setEditedConfig: (config: EtherCatConfig) => void // Function to set the edited configuration
    configLoaded: boolean // Indicates if the configuration has been loaded
    configEdited: boolean // Indicates if the configuration has been edited
    setConfigEdited: (edited: boolean) => void // Function to set the configEdited state
    setConfigLoaded: (loaded: boolean) => void // Function to set the configLoaded state
    configUploaded: boolean // Indicates if the configuration has been uploaded
    setConfigUploaded: (uploaded: boolean) => void // Function to set the configUploaded state
    etherCatRebooting: boolean // Indicates if the EtherCat network is rebooting
    setEtherCatRebooting: (rebooting: boolean) => void // Function to set the etherCatRebooting state
    setUseDummyConfig: (useDummyConfig: boolean) => void
    useDummyConfig: boolean
    uploadConfig: () => Promise<void>
    reboot: () => Promise<void>
    downloadConfig: () => Promise<void>
    initialTabList: { key: string; tab: string }[] // Initial list of tabs
    disabledTabs: string[] // List of currently disabled tabs
    setTabsDisabled: (tabs: string[], disabled: boolean) => void // Function to set tabs disabled/enabled
    enableAll: () => void // Function to enable all tabs except the excluded one
    disableAll: () => void // Function to disable all tabs except the excluded one
}

// Create the context
export const EtherCatConfigContext = createContext<EtherCatConfigContextType | undefined>(undefined)

// Custom hook to use the context
export const useEtherCatConfig = () => {
    const context = useContext(EtherCatConfigContext)
    // if (!context) {
    //     throw new Error("useEtherCatConfig must be used within an EtherCatConfigProvider")
    // }
    return context
}

// Context provider
export const EtherCatConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<EtherCatConfig | null>(null)
    const [editedConfig, setEditedConfig] = useState<EtherCatConfig | null>(null)
    const [configLoaded, setConfigLoaded] = useState(false)
    const [configEdited, setConfigEdited] = useState(false)
    const [configUploaded, setConfigUploaded] = useState(false)
    const [etherCatRebooting, setEtherCatRebooting] = useState(false)
    const [useDummyConfig, setUseDummyConfig] = useState(false)

    const { request } = useConnection()

    useEffect(() => {
        if (config) {
            setEditedConfig({ ...config }) // Make a deep copy if necessary
        }
    }, [config])

    const uploadConfig = async () => {
        if (editedConfig && isMachineConfig(editedConfig)) {
            try {
                await request("load gbem config", { config: editedConfig })
                setConfigUploaded(true)
                message.success("Configuration uploaded successfully.")
            } catch (error) {
                console.error("Failed to upload configuration:", error)
                message.error("Failed to upload configuration. Please try again later.")
                setConfigUploaded(false)
            }
        } else {
            message.error("Edited configuration is invalid. Please check the configuration format.")
            setConfigUploaded(false)
        }
    }

    const reboot = async () => {
        try {
            setEtherCatRebooting(true)
            await request("reboot gbem", { enable: true })
            setTimeout(async () => {
                await request("reboot gbem", { enable: false })
                setEtherCatRebooting(false)
                message.success("Reboot completed.")
            }, 2000)
        } catch (error) {
            console.error("Failed to reboot:", error)
            message.error("Failed to reboot. Please try again later.")
            setEtherCatRebooting(false)
        }
    }

    const downloadConfig = async () => {
        disableAll() // Disable UI elements during loading

        try {
            if (useDummyConfig) {
                // Use the dummy configuration for development
                if (isMachineConfig(exampleConfig)) {
                    setConfig(exampleConfig)
                    setConfigLoaded(true)
                    message.success("Dummy configuration loaded successfully.")
                    enableAll()
                } else {
                    setConfigLoaded(false)
                    message.error("Dummy configuration validation failed.")
                    disableAll()
                }
            } else {
                // Fetch configuration from the server
                const response = await request("get gbem config", {})
                let parsedConfig

                try {
                    // Parse the response configuration
                    parsedConfig =
                        typeof response.config === "string"
                            ? JSON.parse(response.config)
                            : response.config

                    // Validate the parsed configuration
                    if (isMachineConfig(parsedConfig)) {
                        setConfig(parsedConfig)
                        setConfigLoaded(true) // Set configLoaded to true if validation succeeds
                        message.success("Configuration loaded successfully.")
                        enableAll()
                    } else {
                        handleValidationFailure()
                    }
                } catch (parseError) {
                    console.error("Failed to parse configuration JSON:", parseError)
                    message.error("Failed to parse configuration. Please check the format.")
                    disableAll()
                }
            }
        } catch (error) {
            console.error("Failed to load EtherCAT configuration:", error)
            setConfigLoaded(false) // Set configLoaded to false in case of error
            message.error("Failed to load EtherCAT configuration. Please try again later.")
            disableAll()
        }
    }

    function handleValidationFailure() {
        setConfigLoaded(false)
        message.error("Configuration validation failed. Please check the configuration format.")
        disableAll()
    }

    const [activeTabKey, setActiveTabKey] = useState<string>("editConfig")

    const [disabledTabs, setDisabledTabs] = useState(["writeSdo", "readSdo", "optionalSlaves"])

    const excludeTab = "editConfig" // Hardcoded tab to exclude

    const setTabsDisabled = (tabs, disabled) => {
        setDisabledTabs(prevDisabledTabs => {
            if (disabled) {
                return [...new Set([...prevDisabledTabs, ...tabs])]
            } else {
                return prevDisabledTabs.filter(tab => !tabs.includes(tab))
            }
        })
    }

    const enableAll = () => {
        setTabsDisabled(
            initialTabList.map(tab => tab.key).filter(key => key !== excludeTab),
            false
        )
    }

    const disableAll = () => {
        setTabsDisabled(
            initialTabList.map(tab => tab.key).filter(key => key !== excludeTab),
            true
        )
    }

    return (
        <EtherCatConfigContext.Provider
            value={{
                config,
                editedConfig,
                setConfig,
                setEditedConfig,
                configLoaded,
                setConfigLoaded,
                configEdited,
                setConfigEdited,
                configUploaded,
                setConfigUploaded,
                etherCatRebooting,
                setEtherCatRebooting,
                uploadConfig,
                reboot,
                downloadConfig,
                setUseDummyConfig,
                useDummyConfig,
                initialTabList,
                disabledTabs,
                setTabsDisabled,
                enableAll,
                disableAll
            }}
        >
            {children}
        </EtherCatConfigContext.Provider>
    )
}
