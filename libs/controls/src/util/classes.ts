/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

export function classes(...args: (string | undefined)[]) {
    return args.filter(Boolean).join(" ")
}
