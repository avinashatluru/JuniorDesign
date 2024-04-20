import React, { useState, useEffect } from 'react';
import { getAllUsers, getPrograms } from '../actions/users.js'; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [activeUserId, setSelectedUserId] = useState('');
	const [programs, setPrograms] = useState([]);
	const nav = useNavigate();
	const toHome = () => {nav("/")};
  
	useEffect(() => {
	  getAllUsers()
		.then(response => {
		  setUsers(response.data);
		})
		.catch(error => console.error('Error fetching users:', error));
	}, []);
  
	useEffect(() => {
	  if (activeUserId) {
		getPrograms(activeUserId)
		  .then(response => {
			setPrograms(response.data);
		  })
		  .catch(error => {
			console.error('No programs for active user:', error);
			setPrograms([]);
		  });
	  } else {
		setPrograms([]); // Clear programs if no user is active
	  }
	}, [activeUserId]);
  
	const handleUserSelect = (event) => {
	  setSelectedUserId(event.target.value);
	};
  
	return (
	<center>
	  <div style={{ color: 'white' }}>
	  <h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	    <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	    style={{width:50, height:50, display:'inline'}} alt="new"/>
	    <hr style={{color:'white'}}></hr>
		<h1>Select User to Show Their Details</h1>
		<select onChange={handleUserSelect} value={activeUserId}>
		  <option value="">Select a user...</option>
		  {users.map(user => (
			<option key={user._id} value={user._id}>
			  {user.firstName} {user.lastName}
			</option>
		  ))}
		</select>
  
		{activeUserId && (
				<>
				<div className="table-container"></div>
				<h2>Programs</h2>
				{programs.length > 0 ? (
				<table>
					<thead>
					<tr>
						<th>Program Name</th>
						<th>Date</th>
					</tr>
					</thead>
					<tbody>
					{programs.map(program => (
						<tr key={program._id}>
						<td>{program.name}</td>
						<td>{new Date(program.date).toLocaleDateString()}</td>
						</tr>
					))}
					</tbody>
				</table>
				) : (
				<p>No programs found for this user.</p>
				)}
			</>
			)}

	  </div>
	  </center>
	);
  };

export default UserManagement;
