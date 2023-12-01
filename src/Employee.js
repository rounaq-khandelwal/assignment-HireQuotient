// Employee.js
import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Employee = ({
  employee,
  isSelected,
  handleEmployeeSelect,
  handleEmployeeEdit,
  handleEmployeeDelete,
}) => {
  const {
    id: employeeId,
    name: initialName,
    email: initialEmail,
    role: initialRole,
  } = employee;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(initialRole);

  const handleEdit = () => {
    setIsEditing(true);
    handleEmployeeEdit(employeeId, { name, email, role });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(initialName);
    setEmail(initialEmail);
    setRole(initialRole);
    setIsEditing(false);
  };

  const handleDelete = () => {
    handleEmployeeDelete(employeeId);
  };

  return (
    <tr className={isSelected ? 'selected' : ''}>
      <td>{employeeId}</td>
      <td>
        {isEditing ? (
          <input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          name
        )}
      </td>
      <td>
        {isEditing ? (
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          email
        )}
      </td>
      <td>
        {isEditing ? (
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        ) : (
          role
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <SaveIcon
              onClick={handleSave}
              style={{ cursor: 'pointer', marginRight: '5px' }}
            />
            <CancelIcon onClick={handleCancel} style={{ cursor: 'pointer' }} />
          </>
        ) : (
          <>
            <EditIcon
              onClick={handleEdit}
              style={{ cursor: 'pointer', marginRight: '5px' }}
            />
            <DeleteIcon onClick={handleDelete} style={{ cursor: 'pointer' }} />
          </>
        )}
      </td>
    </tr>
  );
};

export default Employee;
