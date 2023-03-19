/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {Vector3, Quaternion, Matrix4} from 'three';

function log(...x) {
    console.log(...x.map(v => v.toArray().map(t => t.toPrecision(3))));
}

const SCALE=new Vector3(1,1,1);

function matrix_mult(U, q, V, p) {
    const m1=new Matrix4().compose(V, p, SCALE);
    m1.invert()

    const m2=new Matrix4().compose(U, q, SCALE);

    const m3=new Matrix4().multiplyMatrices(m1, m2);
    const tr=new Vector3();
    const qr=new Quaternion();
    const s=new Vector3();
    m3.decompose(tr, qr, s);
    return {t:tr, q: qr};
}

function invert(T, q) {
    const m1=new Matrix4().compose(T, q, SCALE);
    m1.invert()
    const tr=new Vector3();
    const qr=new Quaternion();
    const s=new Vector3();
    m1.decompose(tr, qr, s);
    return {t:tr, q: qr};
}

function quat_mult(V, q, U, p) {
    // const {t: U, q: p}=invert(Uf, pf);
    p.invert()
    U.applyQuaternion(p)
    U.negate()

    // console.log("inverse")
    // log(V, q)

    const pq=new Quaternion().multiplyQuaternions(p, q);
    V.applyQuaternion(p);

    const UV=new Vector3().addVectors(U, V);

    return {t:UV, q: pq};
}

const R=Math.sqrt(.5);

const U = new Vector3(2, 2, 0);
const p = new Quaternion(0, 0, R, R);

const V=new Vector3(20, 0,0);
const q = new Quaternion(0, 0, R, R);

log(U, p)
log(V, q)

console.log("matrix...")
const {t: t1, q:q1}=matrix_mult(U, p, V, q)
log(t1, q1);

console.log("quat...")
const {t: t2, q:q2}=quat_mult(U, p, V, q)
console.log("result")
log(t2, q2);

const qq1=new Quaternion(R, 0, 0, R)
const qq2=qq1.clone().invert()

console.log("DOT PRODUCT", qq1.dot(qq2))
