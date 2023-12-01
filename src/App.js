// EmployeeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Employee from './Employee';
import './EmployeeList.css'; // Import CSS file

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    const isSelected = selectedEmployees.includes(employeeId);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleEmployeeEdit = async (employeeId, updatedData) => {
    try {
      const updatedEmployees = employees.map((employee) => {
        if (employee.id === employeeId) {
          return { ...employee, ...updatedData };
        }
        return employee;
      });

      setEmployees(updatedEmployees);

      // Update data using axios put or patch request to the API endpoint
      await axios.put(
        `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members/${employeeId}.json`,
        updatedData
      );
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleEmployeeDelete = async (employeeId) => {
    try {
      const updatedEmployeeList = employees.filter(
        (employee) => employee.id !== employeeId
      );
      setEmployees(updatedEmployeeList);

      // Delete employee data using axios delete request to the API endpoint
      await axios.delete(
        `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members/${employeeId}.json`
      );
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const updatedEmployeeList = employees.filter(
        (employee) => !selectedEmployees.includes(employee.id)
      );
      setEmployees(updatedEmployeeList);

      // Delete selected employees using axios delete requests to the API endpoint
      await Promise.all(
        selectedEmployees.map((employeeId) =>
          axios.delete(
            `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members/${employeeId}.json`
          )
        )
      );
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error deleting selected employees:', error);
    }
  };

  return (
    <div className="employee-list-container">
      <table className="employee-table">
        <thead>
          <tr className="column-titles">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <Employee
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployees.includes(employee.id)}
              handleEmployeeSelect={handleEmployeeSelect}
              handleEmployeeEdit={handleEmployeeEdit}
              handleEmployeeDelete={handleEmployeeDelete}
            />
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedEmployees.length === 0}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
