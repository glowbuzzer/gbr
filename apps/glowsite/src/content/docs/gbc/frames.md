---
title: Frames in GBC
sort: 10
---

# Frames

## Frames and robots

Frames are name attached to the different coordinate systems used for different parts of a machine and its environment and the relationship between them. A Frame defines the position and orientation of one item with respect to another item with a given position and orientation.

The classic chain of frames for a robot is as follows.

```mermaid
graph TD
    id1["W (world)"] <-->id2["R (robot)"]
    id2 <-->id3["TF (tool flange)"]
   id3<-->id4["TCP (tool centre point)"]
   id4<--> id5["W (work)"]
```

The world frame W

  Between these frames transformations exist so that given a set of coordinates in (say) the work frame we wan work out the equivelnt coordinates in the (say) the world frame

```mermaid
   graph TD
   id1["W (world)"] <-->id2["R (robot)"]
    id2 <-->id3["TF (tool flange)"]
   id3<-->id4["TCP (tool centre point)"]
   id4<--> id5["WK (work)"]
   id1<-->|W-to-WK transformation|id5
```



## gcode & frames

gcode has its own concept of frames - its work and fixture offset commands.

```mermaid
graph LR
id1[Unit conversion]-->id2[Relative and Abs]-->id3[G52, G54, G92]-->id4[G51 scaling]-->id5[G68 rotation]

```

