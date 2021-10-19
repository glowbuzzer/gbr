---
title: Orientation in 3D space
sort: 6
---

# Orientation in 3D space

## Introduction

A point (a thing with no length, width, or thickness) in a 3D cartesian space can be specified by three numbers x, y & z.

An object (a thing with a defined length, width and thickness ) in cartesian space can not have its position with just x, y and z because it also has an orientation. Therefore to define a object in 3D space you need to specify its position **and orientation.**

Consider an aeroplane. You can say it is at position x, y & z. But this does not define what angle the aeroplane's nose is pointing in or if it is flying upside down. You need the extra information about its orientation to specify it.

Orientation in geometry can be represented in large number of different ways including:
* rotation quaternions
* Euler angles
* rotation matrices

GBC uses a rotation quaternion to represent orientation.

## Rotation quaternions





Compared to rotation matrices, quaternions are a more compact representation or orientation. Compared to Euler angles, they are simpler to compose and avoid the problem of gimbal lock (see https://en.wikipedia.org/wiki/Gimbal_lock). However, they are not as intuitive and easy to understand as Euler angles. And, due to the periodic nature of sine and cosine, rotation angles recovered angles will be limited to 2 π (in radians).