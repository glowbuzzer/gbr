# AutomationWare utilities and sample applications

```
automationware
|- apps, sample applications
|- assets, catalogue of gltf files for robot parts
|- awlib, git submodule for automationware library
|- lib, library
```

The catalogue of gltf files for robot parts in the `assets` folder
is not used directly. These files are optimised to use Draco compression.
This is done by `gltfjsx.mjs` in this folder. This script generates
Typescript files into the `awlib` project, which contain base64 encoded
versions of the Draco compressed gltf files. The model files are then 
instantiated at runtime.

To run this process, use:

```
node gltfjsx.mjs assets/awtube-parts-v2
```

Output files are written to `awlib/src/scene/parts`.



