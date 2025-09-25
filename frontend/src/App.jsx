import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="font-sans">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/post" element={
            <PrivateRoute>
              <PostDetail />
            </PrivateRoute>
          } />
          <Route path="/post/:id" element={
            <PrivateRoute>
              <PostDetail />
            </PrivateRoute>
          } />
          <Route path="/create-post" element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } />
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
