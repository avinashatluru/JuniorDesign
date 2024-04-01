import React, { useState, useEffect } from 'react';
import { getAllUsers, getPrograms } from '../actions/users.js'; // Adjust the import path as necessary

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [programs, setPrograms] = useState([]);
  
	useEffect(() => {
	  getAllUsers()
		.then(response => {
		  setUsers(response.data);
		})
		.catch(error => console.error('Error fetching users:', error));
	}, []);
  
	useEffect(() => {
	  if (selectedUserId) {
		getPrograms(selectedUserId)
		  .then(response => {
			setPrograms(response.data);
		  })
		  .catch(error => {
			console.error('No programs for selected user:', error);
			setPrograms([]);
		  });
	  } else {
		setPrograms([]); // Clear programs if no user is selected
	  }
	}, [selectedUserId]);
  
	const handleUserSelect = (event) => {
	  setSelectedUserId(event.target.value);
	};
  
	return (
	  <div style={{ color: 'white' }}>
		<h1>Manage Users</h1>
		<select onChange={handleUserSelect} value={selectedUserId}>
		  <option value="">Select a user...</option>
		  {users.map(user => (
			<option key={user._id} value={user._id}>
			  {user.firstName} {user.lastName}
			</option>
		  ))}
		</select>
  
		{selectedUserId && (
		  <>
			<h2>Programs</h2>
			<ul>
			  {programs.length > 0 ? (
				programs.map(program => (
				  <li key={program._id}>
					{program.name} - {new Date(program.date).toLocaleDateString()}
				  </li>
				))
			  ) : (
				<p>No programs found for this user.</p>
			  )}
			</ul>
		  </>
		)}
	  </div>
	);
  };

export default UserManagement;
