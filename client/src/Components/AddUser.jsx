import React, { useState } from "react";
import { createUser } from "../actions/users.js";

//Component which replicates the functionality of the Add User Page
// onUserAdd allows for user list refreshes on the home page
const Add = ({onUserAdd}) => {

	const [isConfirmScreen, setConfirmScreen] = useState(false);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		birthday: ""
	});
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const validate = () => {
		for (let key in form) {
			if (form[key].trim().length === 0) {
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) {
			setError('Please fill out all fields');
			return;
		}

		const isConfirmed = window.confirm("Are you sure you want to add this attendee?");
		if (!isConfirmed) {
			return; // Stop the addition if the user cancels
		}

		try {
			// Call createUser function with form data
			const response = await createUser(form);
			// Handle success (e.g., show success message)
			console.log('Attendee created successfully:', response.data);
		} catch (error) {
			// Handle error (e.g., display error message)
			console.error('Error creating user', error.message);
			setError(`Error creating user: ${error.message}`);
		}
		setForm({ firstName: "", lastName: "", birthday: ""}); // Reset form
		setConfirmScreen(true);
		onUserAdd();
	};

	const addAnother = () => {
		setConfirmScreen(false);
	}

	return (
		<div>
			<center>
				<h3>Add Attendee</h3>
				{!isConfirmScreen &&
					<form onSubmit={handleSubmit}>
						<label style={{marginRight:15}}>First Name:</label>
						<input name="firstName" type="text" value={form.firstName} onChange={handleChange} required /><br/>

						<label style={{marginRight:17}}>Last Name:</label>
						<input name="lastName" type="text" value={form.lastName} onChange={handleChange} required /><br/>

						<label style={{marginRight:17}}>Birthdate:</label>
						<input name="birthday" type="date" value={form.birthday} onChange={handleChange} required /><br/>

						{/* <label style={{color:'white', marginRight:17}}>Program:</label>
						<select name="program" value={form.program} onChange={handleChange} required>
							<option value="">Select a program</option>
							<option value="After School">After School</option>
							<option value="Summer Camp">Summer Camp</option>
							<option value="Spiritual Developement">Spiritual Developement</option>
							<option value="Summer Staff">Summer Staff</option>
							<option value="Family Events">Family Events</option>
						</select><br/>

						<label style={{color:'white', marginRight:17}}>Site:</label>
						<select name="site" value={form.site} onChange={handleChange} required>
							<option value="">Select a site</option>
						<option value="North Avenue">North Avenue</option>
						</select><br/> */}

						{error && <label id="Error" style={{color: 'red'}}>{error}</label>}

						<button type="submit">Add Attendee</button>
					</form>}
				{isConfirmScreen &&
					<div>
						<p id="confirm"> New Attendee was Successfully Added </p>
						<button onClick={addAnother}>Add Another Attendee</button>
					</div>}
			</center>
			<br/>
		</div>
	);
};

export default Add;
