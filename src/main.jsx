// import React from "react";
// import ReactDOM from "react-dom/client";

// function App() {
//   return (
//     <div
//       style={{
//         background: "red",
//         color: "white",
//         height: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: "40px",
//       }}
//     >
//       REACT WORKING 🚀
//     </div>
//   );
// }

// const root = document.getElementById("root");

// ReactDOM.createRoot(root).render(<App />);
require("./react-shim");

const React = require("react");
const ReactDOM = require("react-dom/client");

const App = require("./App.jsx");

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  React.createElement(App)
);