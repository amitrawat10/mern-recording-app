import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserContext } from "./context/userContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { isAuth, isLoading } = useUserContext();
  return isLoading === true ? (
    <div className="App">
      <h1>Loading....</h1>
    </div>
  ) : (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Guest isAuth={isAuth}>
                <Login />
              </Guest>
            }
          />
          <Route
            path="/home"
            element={
              <Protected isAuth={isAuth}>
                <Home />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Guest({ isAuth, children }) {
  if (isAuth) return <Navigate to="/home" replace />;
  return children;
}

function Protected({ isAuth, children }) {
  if (!isAuth) return <Navigate to="/" replace />;
  return children;
}

export default App;
