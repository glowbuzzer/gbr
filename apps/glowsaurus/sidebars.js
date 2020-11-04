/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  someSidebar: {
    Introduction: [
      'GettingStarted'
    ],
    Components: [
      {
        type: "category",
        label: "Digital Readout",
        items: [
          "BitFieldDisplay/BitFieldDisplay",
          "CartesianDro/CartesianDro",
          "DroItem/DroItem",
          "JointDro/JointDro",
          "MotorDro/MotorDro",
          "RobotConfigurationDro/RobotConfigurationDro",
          "SegmentDisplay/SegmentDisplay"
        ]
      },
      {
        type: "category",
        label: "Visualization",
        items: [
          "ToolPathDisplay/ToolPathDisplay"
        ]
      },
      {
        type: "category",
        label: "Tasks",
        items: [
          "tasks/TaskDisplay",
        ]
      },
      {
        type: "category",
        label: "General",
        items: [
          "FrameSelector/FrameSelector",
          "FrameView/FrameView"
        ]
      }
    ],
    Hooks: [
      'hooks/usePrefs',
      'hooks/useConfig',
      'hooks/useKinematics'
    ]
  },
};
