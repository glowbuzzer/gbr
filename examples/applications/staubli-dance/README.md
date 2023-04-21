# Glowbuzzer React Staubli Synchronized Motion Example

This example demonstrates a robot application using the Glowbuzzer React framework.
The application has two independent robots, which execute different moves that are precisely
synchronized in time. The synchronization uses queued moves which specify durations in milliseconds, rather
than any kind of gearing or other mechanism.

To run this example:

1. Run GBC:
    ```bash
    gbc
    ```
1. Start the React app using `vite examples/applications/staubli-dance`
1. Open the app in your browser
1. Click the settings ⚙️ in the Connect tile to specify the address of GBC
1. Connect to GBC
1. Enable operation
1. Use the Demo tile to reset and start the motion
