/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

/**
 * NOT CURRENTLY USED - WRITTEN BY OUR FRIEND !!!!
 */
export function jacobiEigenSolver(a: number[][]): {
    eigenvalues: number[]
    eigenvectors: number[][]
} {
    const n = a.length
    let maxIterations = 100 // You can adjust this value
    const tol = 1.0e-10 // Tolerance
    let v = Array.from({ length: n }, () => Array(n).fill(0))
    let d = Array(n).fill(0)

    // Initialize v to the identity matrix
    for (let i = 0; i < n; i++) {
        v[i][i] = 1.0
        d[i] = a[i][i]
    }

    for (let iter = 0; iter < maxIterations; iter++) {
        let maxOffDiag = 0
        let p = 0,
            q = 0

        // Find the maximum off-diagonal absolute value
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(a[i][j]) > maxOffDiag) {
                    maxOffDiag = Math.abs(a[i][j])
                    p = i
                    q = j
                }
            }
        }

        if (maxOffDiag < tol) {
            return { eigenvalues: d, eigenvectors: v }
        }

        // Calculate rotation to eliminate the pq component
        let r = Math.hypot((a[q][q] - a[p][p]) / 2.0, a[p][q])
        let c = Math.sqrt((1.0 + Math.abs(a[p][p] - a[q][q]) / (2.0 * r)) / 2.0)
        let s = (a[p][q] > 0 ? 1 : -1) * Math.sqrt(1 - c * c)
        let t = s / (2.0 * c)

        // Update eigenvalues
        d[p] += t * a[p][q]
        d[q] -= t * a[p][q]
        a[p][q] = a[q][p] = 0.0

        // Update eigenvectors and the matrix
        for (let k = 0; k < n; k++) {
            if (k !== p && k !== q) {
                let akp = c * a[k][p] + s * a[k][q]
                let akq = -s * a[k][p] + c * a[k][q]
                a[k][p] = a[p][k] = akp
                a[k][q] = a[q][k] = akq
            }
            let rkp = c * v[k][p] + s * v[k][q]
            let rkq = -s * v[k][p] + c * v[k][q]
            v[k][p] = rkp
            v[k][q] = rkq
        }
    }

    return { eigenvalues: [], eigenvectors: [] } // Didn't converge
}
