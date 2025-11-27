import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
}

export default App;
