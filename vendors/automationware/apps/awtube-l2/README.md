# Glowbuzzer React AutomationWare Example

This example demonstrates an AutomationWare robot application using the Glowbuzzer React framework.
The application has generic approach to building up the AW Tube robot arm from a kit of parts.
The visual contruction of the robot arm is done by `AwTubeRobot` in `lib/awtube/scene`.

This project instantiates a specific configuration of AutomationWare joint sizes:

```
J32, J32, J25, J20, J17, J17
```

To run this example:

1. Run GBC:
    ```bash
    gbc
    ```
1. Start the React app using `vite vendors/automationware/apps/aw-1408/32-32-25-20-17-17`
1. Open the app in your browser 
1. Connect to GBC and push the configuration
1. Clear the initial fault and enable operation
1. You can now jog the robot in simulation mode
