# Example front-end using React Native

This project, built using [Expo](https://expo.dev), demonstrates a native mobile application that is able to connect to
the Glowbuzzer Control (GBC).

For details, [see the blog post](https://www.glowbuzzer.com/blogs/xxxxx).

To run the project:

1. Install dependencies:
    ```
    npm install
    ```

1. Ensure your phone or mobile device is on the same network as GBC
2. Determine the IP address of the machine where GBC is running
3. Edit the constant `CONNECT_URL` in `SimpleConnectView.tsx`
4. Start the application:
    ```
    npm start
    ```
5. Install and run the Expo app on your device
6. Scan the barcode given

You should be able to connect and disconnect from GBC, enable operation and move a joint.
