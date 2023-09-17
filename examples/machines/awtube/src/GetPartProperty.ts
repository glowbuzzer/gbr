import { PartData, PartInfo, RobotArmPartsUsed } from "./PartData"

export function getPartProperty(
    robotArmParts: RobotArmPartsUsed,
    partData: PartData,
    partType: string,
    index: number,
    propertyName: keyof PartInfo
): number | string | undefined {
    const partNames = robotArmParts[partType]
    if (!partNames || index < 0 || index >= partNames.length) {
        return undefined
    }
    const part = partNames[index]
    const partInfo = partData[partType]?.[part.partName]
    const propertyValue = partInfo?.[propertyName]

    if (typeof propertyValue === "string" || typeof propertyValue === "number") {
        return propertyValue
    }

    return undefined
}