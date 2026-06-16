require("./react-shim");

const React = require("react");
const ReactDOM = require("react-dom/client");
const { loadSettings } = require("./utils/setting.js");
const App = require("./App.jsx");

loadSettings();
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(React.createElement(App));
