// import { Button } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Home from "./pages/Home/";
import Register from "./pages/Register/";
import Profile from "./pages/Profile/index";
import ProtectedPage from "./components/ProtectedPage";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";

function App() {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
                {/* as we have enclosed home within the ProtectedPage we dont need to write any validation logic for the Home page all authorization and validation will take place in the ProtectedPage  */}
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
                {/* as we have enclosed home within the ProtectedPage we dont need to write any validation logic for the Home page all authorization and validation will take place in the ProtectedPage  */}
              </ProtectedPage>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
