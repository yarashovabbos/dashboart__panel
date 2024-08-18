import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
  });

  const handleClose = () => {
    setShow(false);
    setEditUser(null);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      phone: "",
    });
  };

  const handleShow = () => setShow(true);

  // Get all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const addUser = async () => {
    try {
      await axios.post("http://localhost:3000/users", newUser);
      fetchUsers(); // Refresh user list
      handleClose();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  // Edit existing user
  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:3000/users/${editUser.id}`, newUser);
      fetchUsers(); // Refresh user list
      handleClose();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      updateUser();
    } else {
      addUser();
    }
  };

  // Open the modal to edit user
  const handleEdit = (user) => {
    setEditUser(user);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
      phone: user.phone,
    });
    handleShow();
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-3xl font-bold mb-4">Users Management</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleShow}
      >
        Add New User
      </button>
      <table className="table-auto w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.firstName}</td>
              <td className="px-4 py-2">{user.lastName}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editUser ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block font-medium mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter first name"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter last name"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter phone number"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editUser ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
