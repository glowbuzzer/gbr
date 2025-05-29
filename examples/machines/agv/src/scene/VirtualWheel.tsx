/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Sphere } from "@react-three/drei"

export const VirtualWheel = ({ radius = 1 }) => {
    return (
        <group>
            <Sphere scale={radius}>
                <shaderMaterial
                    attach="material"
                    transparent={true}
                    vertexShader={`
                        varying vec3 vNormal;
                        void main() {
                          vNormal = normal;
                          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        varying vec3 vNormal;
                        void main() {
                          vec3 color;
                          bool y = vNormal.y > 0.0;
                          bool x = vNormal.x > 0.0;
                          bool z = vNormal.z > 0.0;

                          bool is_black = bool(int(y) ^ int(x) ^ int(z));

                          if (is_black) {
                            color = vec3(0.0, 0.0, 0.0); // Black
                          } else {
                            color = vec3(1.0, 1.0, 1.0); // White
                          }
                          gl_FragColor = vec4(color, 0.3);
                        }
                    `}
                />
            </Sphere>
        </group>
    )
}
