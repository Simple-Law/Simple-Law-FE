import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Read from "./Dashboard/Read";
import Reply from "./Dashboard/Reply";

const Admin = () => {
  return (
    <div>
      <Routes>
        <Route path="/board" element={<Dashboard />} />
        <Route path="/board/read/:id" element={<Read />} />
        <Route path="/board/reply/:id" element={<Reply />} />
      </Routes>
    </div>
  );
};

export default Admin;
