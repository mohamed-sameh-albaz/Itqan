// Client/src/views/RolesPage.js
import React, { useState, useEffect } from 'react';
import { requestAPI } from '../hooks/useAPI';
import CommunityNavBar from '../components/CommunityNavBar';
import './RolesPage.css';
const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState({ name: '', description: '', color: '' });
  const [editRole, setEditRole] = useState({ id: null, name: '', description: '', color: '' });

  useEffect(() => {
    const fetchRoles = async () => {
      const { status, data } = await requestAPI('/roles', 'get');
      if (status > 199 && status < 300) {
        setRoles(data.data.roles);
      } else {
        console.error('Error fetching roles');
      }
      setLoading(false);
    };

    fetchRoles();
  }, []);

  const handleDeleteRole = async (roleId) => {
    const { status } = await requestAPI(`/roles/${roleId}`, 'delete');
    if (status > 199 && status < 300) {
      setRoles(roles.filter(role => role.id !== roleId));
      alert(`Role with ID ${roleId} has been deleted`);
    } else {
      console.error('Error deleting role');
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    const { status, data } = await requestAPI('/roles', 'post', {
      body: newRole
    });
    if (status > 199 && status < 300) {
      setRoles([...roles, data.data.role]);
      setNewRole({ name: '', description: '', color: '' });
    } else {
      console.error('Error adding role');
    }
  };

  const handleEditRole = async (e) => {
    e.preventDefault();
    const { status, data } = await requestAPI(`/roles/${editRole.id}`, 'put', {
      body: editRole
    });
    if (status > 199 && status < 300) {
      setRoles(roles.map(role => (role.id === editRole.id ? data.data.role : role)));
      setEditRole({ id: null, name: '', description: '', color: '' });
    } else {
      console.error('Error editing role');
    }
  };

  const handleEditClick = (role) => {
    setEditRole(role);
  };

  return (
    <div>
      <CommunityNavBar />
      <div className="container mx-auto mt-5">
        <h2 className="text-2xl font-bold mb-4">Roles</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <form onSubmit={handleAddRole} className="mb-4">
              <h3 className="text-xl font-bold mb-2">Add Role</h3>
              <input
                type="text"
                placeholder="Name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="mb-2 p-2 border"
              />
              <input
                type="text"
                placeholder="Description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                className="mb-2 p-2 border"
              />
              <input
                type="text"
                placeholder="Color"
                value={newRole.color}
                onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                className="mb-2 p-2 border"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Role
              </button>
            </form>

            {editRole.id && (
              <form onSubmit={handleEditRole} className="mb-4">
                <h3 className="text-xl font-bold mb-2">Edit Role</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={editRole.name}
                  onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                  className="mb-2 p-2 border"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editRole.description}
                  onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                  className="mb-2 p-2 border"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={editRole.color}
                  onChange={(e) => setEditRole({ ...editRole, color: e.target.value })}
                  className="mb-2 p-2 border"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
              </form>
            )}

            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Color</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={role.id}>
                    <td className="py-2 px-4 border-b">{role.id}</td>
                    <td className="py-2 px-4 border-b">{role.name}</td>
                    <td className="py-2 px-4 border-b">{role.description}</td>
                    <td className="py-2 px-4 border-b" style={{ color: role.color }}>{role.color}</td>
                    <td className="py-2 px-4 border-b">
                      {index >= 3 ? (
                        <>
                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleEditClick(role)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            disabled
                          >
                            Cannot Edit
                          </button>
                          <button
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            disabled
                          >
                            Cannot Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default RolesPage;