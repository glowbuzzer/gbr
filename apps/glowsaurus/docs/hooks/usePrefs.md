---
id: usePrefs
---

This hook provides access to and persistent storage of preferences that are used throughout the application.

Components re-render automatically as preferences change.

Some Glowbuzzer components use and modify Glowbuzzer standard preferences such as preferred units. You can also add
your own application preferences as required.

Preferences are stored in browser local storage. 

## Simple example

This example stores a custom preference named "mypref". Try entering a new value and refreshing the page.

```jsx gb=hooks/usePrefs_simple.example.jsx
PLACEHOLDER
```

## Unit selection example

This example uses the `UnitSelector` component and displays the selected scalar units.

```jsx gb=hooks/usePrefs_units.example.jsx
PLACEHOLDER
```


## Standard preferences

<table>
<thead>
<tr>
    <th>Name</th>
    <th>Description</th>
    <th>Default</th>
</tr>
</thead>
<tbody>
<tr>
    <td>units_scalar</td>
    <td>Scalar display units</td>
    <td>Millimeters (mm)</td>
</tr>
<tr>
    <td>units_angular</td>
    <td>Angular display units</td>
    <td>Radians (rad)</td>
</tr>
</tbody>
</table>
