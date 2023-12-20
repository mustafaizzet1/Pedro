import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helper/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    // Create a variable to track whether the component is mounted
    let isMounted = true;

    // Use an async function to make the axios call
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        if (isMounted) {
          if (response.data.error) {
            console.error("Authentication check failed:", response.data.error);
            setAuthState(false);
          } else {
            setAuthState(true);
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        if (isMounted) {
          setAuthState(false);
        }
      }
    };

    fetchData();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="/"> Home Page</Link>
            <Link to="/createpost"> Create A Post</Link>
            {!authState && (
              <>
                <Link to="/login"> Login</Link>
                <Link to="/registration"> Registration</Link>
              </>
            )}
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/login" exact element={<Login />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
