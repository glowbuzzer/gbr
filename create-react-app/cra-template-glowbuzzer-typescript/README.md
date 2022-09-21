# cra-template-typescript

This is the official TypeScript template for [Glowbuzzer UI Apps](https://github.com/glowbuzzer).

To use this template, add `--template glowbuzzer-typescript` when creating a new app.

For example:

```sh
npx create-react-app my-app --template glowbuzzer-typescript

# or

yarn create react-app my-app --template glowbuzzer-typescript
```

For more information, please refer to [Getting Started](https://www.glowbuzzer.com/get-started/frontend).

Note that Glowbuzzer likes `pnpm` for package management, but CRA will use `npm` or `yarn` on the initial install.
If you want to use `pnpm` you need to wait for the initial install to complete, then delete `node_modules` and run
`pnpm install`.
