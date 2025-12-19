import React, { useState } from "react";
import "@/App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardPage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
