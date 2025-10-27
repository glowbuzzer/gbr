export const DEFAULT_SETTINGS = {
    grid: true,
    environment: true,
    ambientLight: true,
    hemisphereLight: true,
    directionalLight: true,
    pointLight: true,
    spotLight: true,
    deMetal: false,
    castShadow: false,
    lightingIntensity: 10,
    envMapIntensity: 1
}
export type SceneSettings = {
    [K in keyof typeof DEFAULT_SETTINGS]?: (typeof DEFAULT_SETTINGS)[K]
}
