import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import './EmployeeList.css'; // Import a CSS file for styling

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        setEmployees(response.data);
        initializeEditableRows(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const initializeEditableRows = (data) => {
    const initialEditState = {};
    data.forEach((employee) => {
      initialEditState[employee.id] = false;
    });
    setEditableRows(initialEditState);
  };

  const toggleEdit = (id) => {
    setEditableRows({
      ...editableRows,
      [id]: !editableRows[id],
    });
  };

  const handleEdit = (id) => {
    toggleEdit(id);
  };

  const handleDelete = (id) => {
    let updatedRows = [...selectedRows]; // Create a copy of selectedRows

    if (id) {
      // Individual delete
      updatedRows = updatedRows.filter((rowId) => rowId !== id);
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );
      setEmployees(updatedEmployees);
      const updatedEditableRows = { ...editableRows };
      delete updatedEditableRows[id];
      setEditableRows(updatedEditableRows);
    } else {
      // Bulk delete
      const updatedEmployees = employees.filter(
        (employee) => !selectedRows.includes(employee.id)
      );
      setEmployees(updatedEmployees);
      initializeEditableRows(updatedEmployees);
    }

    setSelectedRows([]); // Clear selectedRows after deletion

    // ... (existing code)
  };
  // const handleDelete = (id) => {
  //   let updatedRows = [...selectedRows]; // Create a copy of selectedRows

  //   if (id) {
  //     // Individual delete
  //     updatedRows = updatedRows.filter((rowId) => rowId !== id);
  //     const updatedEmployees = employees.filter(
  //       (employee) => employee.id !== id
  //     );
  //     setEmployees(updatedEmployees);
  //     const updatedEditableRows = { ...editableRows };
  //     delete updatedEditableRows[id];
  //     setEditableRows(updatedEditableRows);
  //   } else {
  //     // Bulk delete
  //     const updatedEmployees = employees.filter(
  //       (employee) => !selectedRows.includes(employee.id)
  //     );
  //     setEmployees(updatedEmployees);
  //     setSelectedRows([]);
  //     initializeEditableRows(updatedEmployees);
  //   }

  //   setSelectedRows(updatedRows); // Update selectedRows
  // };

  const handleInputChange = (e, id, field) => {
    const updatedEmployees = employees.map((employee) => {
      if (employee.id === id) {
        return {
          ...employee,
          [field]: e.target.value,
        };
      }
      return employee;
    });
    setEmployees(updatedEmployees);
  };

  const handleSearch = (e) => {
    setTempSearchTerm(e.target.value);
  };

  const handleSearchButtonClick = () => {
    // Trigger search when the search button is clicked
    // Optionally, you can add additional logic here if needed

    setSearchTerm(tempSearchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Trigger search when ENTER key is pressed
      setSearchTerm(tempSearchTerm);
    }
  };

  const clearSearch = () => {
    setTempSearchTerm('');
    setSearchTerm('');
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    const allDisplayedRows = currentItems.map((item) => item.id);
    setSelectedRows(
      selectedRows.length === allDisplayedRows.length ? [] : allDisplayedRows
    );
  };

  const filteredEmployees = employees.filter((employee) => {
    const { name, email, role } = employee;
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container">
      <h1>Employee List</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={tempSearchTerm}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        {tempSearchTerm && (
          <ClearIcon className="clear-icon" onClick={clearSearch} />
        )}
        <button onClick={handleSearchButtonClick}>
          <SearchIcon className="search-icon" />
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === currentItems.length}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((employee) => (
            <tr
              key={employee.id}
              className={
                selectedRows.includes(employee.id) ? 'selected-row' : ''
              }
            >
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(employee.id)}
                  checked={selectedRows.includes(employee.id)}
                />
              </td>
              <td>{employee.id}</td>
              <td>
                {editableRows[employee.id] ? (
                  <input
                    type="text"
                    value={employee.name}
                    onChange={(e) => handleInputChange(e, employee.id, 'name')}
                  />
                ) : (
                  employee.name
                )}
              </td>
              <td>
                {editableRows[employee.id] ? (
                  <input
                    type="text"
                    value={employee.email}
                    onChange={(e) => handleInputChange(e, employee.id, 'email')}
                  />
                ) : (
                  employee.email
                )}
              </td>
              <td>
                {editableRows[employee.id] ? (
                  <input
                    type="text"
                    value={employee.role}
                    onChange={(e) => handleInputChange(e, employee.id, 'role')}
                  />
                ) : (
                  employee.role
                )}
              </td>
              <td>
                <div className="actions">
                  {editableRows[employee.id] ? (
                    <SaveIcon
                      className="save-icon"
                      onClick={() => toggleEdit(employee.id)}
                    />
                  ) : (
                    <EditIcon
                      className="edit-icon"
                      onClick={() => handleEdit(employee.id)}
                    />
                  )}
                  <DeleteIcon
                    className="delete-icon"
                    onClick={() => handleDelete(employee.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">{renderPagination()}</div>
      <div className="delete-selected">
        <button onClick={() => handleDelete()}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
