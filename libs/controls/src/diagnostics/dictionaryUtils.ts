export type DictionaryNode = {
    children?: Record<string, DictionaryNode>
    type?: "array" | "object"
    name?: string
    nameProperty?: string
    // convert?(value: any): string
    convert?(value: any, obj: any): string
}
