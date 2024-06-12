import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ReactApp from "./page/ReactApp";
import VueApp from "./page/VueApp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Link to="/react">React 应用</Link>
        {" | "}
        <Link to="/vue">Vue 应用</Link>
        <Routes>
          <Route path="/react/*" element={<ReactApp />} />
          <Route path="/vue/*" element={<VueApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
