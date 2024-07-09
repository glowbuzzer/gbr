/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

// noinspection JSUnresolvedLibraryURL,HtmlUnknownAttribute,CheckTagEmptyBody

import { mkdirSync, writeFileSync } from "fs"
import { Quaternion, Vector3 } from "three"

// noinspection HtmlUnknownAttribute,JSUnresolvedVariable,CheckTagEmptyBody
const head = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>chart-csv</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.css" rel="stylesheet" type="text/css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.15/d3.min.js" charset="utf-8"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
</head>
<body onload="run()">

<div id="tag"></div>
<div id="fro"></div>
<div id="pos"></div>
<div id="vel"></div>
<div id="acc"></div>
<div id="jerk"></div>
<div id="p"></div>
<div id="q"></div>

<script>

function parseCSV (csv) {
  console.log("parse csv")
  return csv.split('\\n')
    .filter(function (row) {
      return !!row.trim()
    })
    .map(function (row) {
      return row.split(',')
    })
}

function haveHead (csv) {
  return !/^\\d+$/.test(csv[0][0])
}

function chart (id, csv) {
  csv = parseCSV(csv)

  var columns = []
  var showLegend = haveHead(csv)

  if (showLegend) {
    csv.shift().forEach(function (head) {
      columns.push([head])
    })
  } else {
    for (var n = 0; n < csv[0].length; n++) {
      columns.push([n])
    }
  }

  csv.forEach(function (r) {
    r.forEach(function (c, i) {
      columns[i].push(Number(c))
    })
  })

  var opts = {
    bindto: '#' + id,
    data: {
      columns: columns,
      type: 'line'
    },
    point: { show: false },
    axis: { x: { show: true } },
    legend: { show: showLegend }
  }

  c3.generate(opts)
}

function run () {
  chart('tag', tag_csv)
  chart('fro', fro_csv)
  chart('pos', pos_csv)
  chart('vel', vel_csv)
  chart('acc', acc_csv)
  chart('jerk', jerk_csv)
  chart('p', p_csv)
  chart('q', q_csv)
}`

const tail = `
</script>
</body>
</html>`

export function make_plot(
    filename: string,
    data: {
        joints: number[]
        translation: Vector3
        rotation: Quaternion
        activity: { tag: number; streamState: number; activityState: number }
        fro: { target: number; actual: number }
    }[]
) {
    // assume first row of data gives the joint count
    const first_row = data[0].joints.map((_, i) => "J" + i).join(",")

    const joint_positions = data.map(d => d.joints)

    const vel = joint_positions.map((joints, index) =>
        joints.map((j, joint_index) => 250 * (j - joint_positions[index - 1]?.[joint_index] || 0))
    )
    const acc = vel.map((joints, index) =>
        joints.map((j, joint_index) => 250 * (j - vel[index - 1]?.[joint_index] || 0))
    )
    const jerk = acc.map((joints, index) =>
        joints.map((j, joint_index) => 250 * (j - acc[index - 1]?.[joint_index] || 0))
    )

    const p = data.map(d => d.translation)
    const q = data.map(d => d.rotation)

    const tag_csv = data
        .map(r => `${r.activity.tag},${r.activity.streamState},${r.activity.activityState}`)
        .join("\n")
    const fro_csv = data.map(r => `${r.fro.target},${r.fro.actual}`).join("\n")
    const joints_csv = joint_positions.map(r => r.join(",")).join("\n")
    const vel_csv = vel.map(r => r.join(",")).join("\n")
    const acc_csv = acc.map(r => r.join(",")).join("\n")
    const jerk_csv = jerk.map(r => r.join(",")).join("\n")

    const p_csv = p.map(r => `${r.x},${r.y},${r.z}`).join("\n")
    const q_csv = q.map(r => `${r.x},${r.y},${r.z},${r.w}`).join("\n")

    mkdirSync("plot", { recursive: true })
    const html = `
    ${head}
    const tag_csv=\`ACTIVITY TAG,STREAM STATE,ACTIVITY_STATE\n${tag_csv}\`
    const fro_csv=\`FRO TARGET,FRO ACTUAL\n${fro_csv}\`
    const pos_csv=\`${first_row}\n${joints_csv}\`
    const vel_csv=\`${first_row}\n${vel_csv}\`
    const acc_csv=\`${first_row}\n${acc_csv}\`
    const jerk_csv=\`${first_row}\n${jerk_csv}\`
    const p_csv=\`X,Y,Z\n${p_csv}\`
    const q_csv=\`QX,QY,QZ,QW\n${q_csv}\`
    ${tail}
    `
    console.log("Writing plot file:", filename)
    writeFileSync("plot/" + filename + ".html", html)
}
