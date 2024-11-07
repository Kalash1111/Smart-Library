import React, { useState, useEffect } from "react";

const TeacherLogin = () => {
  const [teacherId, setTeacherId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Ensure the teacher is logged out on initial load
    setLoggedIn(false);
    setTeacherId(""); // Clear any ID from previous sessions
  }, []);

  const loginAsTeacher = () => {
    if (teacherId === "9999" || teacherId === "7272") {
      setLoggedIn(true);
      console.log("Logged in successfully");
    } else {
      console.error("Invalid Teacher ID");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setTeacherId(""); // Clear the ID on logout
    console.log("Logged out successfully");
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <p>Logged in as a mother  teacher.</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <label htmlFor="teacherId">Enter Teacher ID: </label>
          <p style={{ textAlign: "right", display: "flex", margin: "2px" }}>
            <input
              type="text"
              id="teacherId"
              placeholder="Enter your teacher ID"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            />
            <button onClick={loginAsTeacher} style={{ padding: "2px", marginLeft: "5px" }}>
              Login
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherLogin;
