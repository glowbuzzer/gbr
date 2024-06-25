export type DefaultValue =
    | { type: "string"; value: string }
    | { type: "number"; value: number }
    | { type: "boolean"; value: boolean }
    | {
          type: "undefined" | undefined
      }
