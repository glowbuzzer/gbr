import React from "react"
import ReactDOM from "react-dom"

import App from "./app/app"
import { GlowbuzzerApp } from "@glowbuzzer/store"
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
//
// const reducer = (state: any = {}, action) => {
//   switch (action.type) {
//     case 'TEST':
//       return {
//         ...state,
//         test: true
//       };
//   }
//   return state;
// };
//
// const store = createStore(reducer);

ReactDOM.render(
    <GlowbuzzerApp>
        <App />
    </GlowbuzzerApp>,
    document.getElementById("root")
)
