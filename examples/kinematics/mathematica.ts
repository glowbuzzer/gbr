export const Sin = Math.sin
export const Cos = Math.cos
export const Csc = a => 1 / Math.sin(a)
export const Cot = a => 1 / Math.tan(a)
export const Pi = Math.PI
export const Power = (a, b) => Math.pow(a, b)
export const Sqrt = a => Math.sqrt(Math.abs(a))
export const NamedList = (...items: { label: string; value: number }[]) => items
export const Rule = (label: string, value: number) => ({ label: label, value: value })
export const List = (...items: any[]): any[] => items
export const Abs = Math.abs
export const Less = (...args: number[]): boolean[] => {
    let result = args.map(() => false)
    for (let n = 0; n < args.length - 1; n++) {
        if (args[n] < args[n + 1]) {
            result[n] = true
        }
    }
    return result
}
