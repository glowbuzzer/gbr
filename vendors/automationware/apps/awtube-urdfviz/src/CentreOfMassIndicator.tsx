/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"

export const CentreOfMassIndicator = ({ position }) => {
    return (
        <mesh scale={0.015} position={position}>
            <sphereBufferGeometry args={[1, 32, 32]} />
            <shaderMaterial
                attach="material"
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
                  gl_FragColor = vec4(color, 1.0);
                }
        `}
            />
        </mesh>
    )
}
