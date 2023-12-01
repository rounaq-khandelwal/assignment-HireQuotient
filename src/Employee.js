// Employee.js
import React from 'react';

const Employee = ({ employee }) => {
  const { id, name, email, role } = employee;

  const handleEdit = () => {
    // Implement edit functionality
  };

  const handleDelete = () => {
    // Implement delete functionality
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{role}</td>
      <td>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default Employee;
