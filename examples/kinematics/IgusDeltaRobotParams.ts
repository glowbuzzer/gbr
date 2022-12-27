import { angledLinearDeltaRobotParams } from "./AngledLinearDeltaKin"

export const DLE_DR_0001: angledLinearDeltaRobotParams = {
    distanceZ1: 169.5,
    distanceZ2: 103.8,
    radius1: 221.3,
    radius2: 117.5,
    tcpRadius: 42,
    sliderAngle: Math.PI / 4,
    jointLength: 400,
    carriagePivotOffsetZ: 82.67,
    carriagePivotOffsetY: 36.7,
    carriagePivotOffsetX: 39.4, //distance between two rods
    effectorShaftLength: 39.4,
    effectorInnerCircleRadius: 42
}

export const DLE_DR_0050: angledLinearDeltaRobotParams = {
    distanceZ1: 159.4,
    distanceZ2: 159.4,
    radius1: 377.7,
    radius2: 156.1,
    tcpRadius: 42,
    sliderAngle: Math.PI / 4,
    jointLength: 600,
    carriagePivotOffsetZ: 82.67,
    carriagePivotOffsetY: 36.7,
    carriagePivotOffsetX: 39.4, //distance between two rods
    effectorShaftLength: 39.4,
    effectorInnerCircleRadius: 42
}
