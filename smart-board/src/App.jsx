import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import Login from "views/auth/Login";
import { auth } from "config/auth";

const RequireAuth = ({ children }) =>
  auth.isAuthed() ? children : <Navigate to="/login" replace />;

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="admin/*"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
