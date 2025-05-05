import React, { useEffect, useState } from 'react';
import useUserStore from '../userStore';
import "./crud.css";

const CRUD = () => {
  const {
    users,
    fetchUsers,
    setUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUserStore();

  const [action, setAction] = useState('GET');
  const [id, setId] = useState('');
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setId('');
    setFormData({});
    setResponse(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIdChange = (e) => setId(e.target.value);

  const validateForm = () => {
    const { name, email, phone } = formData;
    if (!name || !email || !phone) return 'All fields are required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format.';
    if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) return 'Phone number must be 10-15 digits.';
    return null;
  };

  const handleFetch = () => {
    setResponse(users);
    setError(null);
  };

  const handleCreate = () => {
    const validationError = validateForm();
    if (validationError) return setError(validationError);
    createUser(formData);
    setResponse(formData);
    setFormData({});
    setError(null);
  };

  const handleUpdate = () => {
    const trimmedId = id.trim();
    const userExists = users.find(u => u.id === trimmedId);
    if (!userExists) return setError(`No user found with ID: ${trimmedId}`);
    const validationError = validateForm();
    if (validationError) return setError(validationError);
    updateUser(trimmedId, formData);
    setResponse({ id: trimmedId, ...formData });
    setFormData({});
    setId('');
    setError(null);
  };

  const handleDelete = () => {
    const trimmedId = id.trim();
    const exists = users.some(u => u.id === trimmedId);
    if (!exists) return setError(`No user found with ID: ${trimmedId}`);
    deleteUser(trimmedId);
    setResponse({ message: `User with ID ${trimmedId} deleted.` });
    setId('');
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    if (action === 'GET') handleFetch();
    else if (action === 'POST') handleCreate();
    else if (action === 'PUT') {
      if (!id) return setError('ID is required for update.');
      handleUpdate();
    } else if (action === 'DELETE') {
      if (!id) return setError('ID is required for deletion.');
      handleDelete();
    }
  };

  return (
    <div className="crud-container">
      <h2>User CRUD (Zustand)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Action:
          <select value={action} onChange={handleActionChange}>
            <option value="GET">GET - View all users</option>
            <option value="POST">POST - Create user</option>
            <option value="PUT">PUT - Update user</option>
            <option value="DELETE">DELETE - Delete user</option>
          </select>
        </label>

        {(action === 'PUT' || action === 'DELETE') && (
          <div>
            <label>ID:</label>
            <input
              type="text"
              value={id}
              onChange={handleIdChange}
              placeholder="Enter user ID"
              required
            />
          </div>
        )}

        {(action === 'POST' || action === 'PUT') && (
          <>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </>
        )}

        <button type="submit">Submit</button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '10px' }}><strong>Error:</strong> {error}</div>}
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Response:</h3>
          {Array.isArray(response) ? (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {response.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre>{JSON.stringify(response, null, 2)}</pre>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>All Users</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRUD;
