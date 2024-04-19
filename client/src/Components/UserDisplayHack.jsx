import React, { useState, useRef } from "react";
import { getPrograms } from "../actions/users";

/**
 * Hack UI to allow for the editing & deletion of users from the 
 */
export default function EditableUserNameDisplay({data, style, onUserUpdate}) {

	const [programs, setPrograms] = useState([]);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		birthday: ""
	});
	
	const [editing, setEditing] = React.useState(false);
	
	const setStartValue = () => {
		setForm({firstName: data[2],lastName: data[3], birthday: data[4].slice(0, 10)})
	};
	
	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};
	
	const handleClickUserName = (e) => {
		if (!editing) {
			setEditing(true);
			setStartValue();

			getPrograms(data[1])
			.then(response => {
			  setPrograms(response.data);
			})
			.catch(error => {
			  console.error('No programs for active user:', error);
			  setPrograms([]);
			});
		} else {
			//Handle Undoing or caching edits
			setEditing(false);
		}
	}
	
	const validate = () => {
		for (let key in form) {
			if (form[key].trim().length === 0) {
				return false;
			}
		}
		return true;
	};

	const handleUpdateUser = async (e) => {
		e.preventDefault();

		if (!validate()) {
			window.alert('Please fill out all fields');
			return;
		}
	
		await fetch(`http://localhost:5050/api/attendees/${data[1]}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(form),
		}).catch(error => {
			window.alert("I'm sorry, the database has returned an error from your attempt to edit user \"" + data[0] +"\" id: " + data[1] + ". Please report this with the following error message to the developers. " + error);
			return;
		});

		setEditing(false);
		onUserUpdate();
	}

	const handleDeleteUser = async (e) => {
		await fetch(`http://localhost:5050/api/attendees/${data[1]}`, {
			method: "DELETE"
		}).catch(error => {
			window.alert("I'm sorry, the database has returned an error from your attempt to delete user \"" + data[0] +"\" id: " + data[1] + ". Please report this with the following error message to the developers. " + error);
			return;
		});

		console.log("Deleted Attendee \"" + data[0] + "\" id: " + data[1]);

		setEditing(false);
		onUserUpdate();
	}
	
	const NameDisplay = ({name, style}) => {
		return (
			<p onClick={handleClickUserName} className={`${editing ? "clickable active" : "clickable"}`} style={style}> {name} </p>
		)
	}
	
	return (
		<>
			<NameDisplay name={data[0]} style={{display: "flex", "fontStyle": "italic", justifyContent: 'center', 
      alignItems: 'center' }}/>
			{editing ? 
				<div>
					<form onSubmit={handleUpdateUser}>
						<label style={{marginRight:15}}>First Name:</label>
						<input name="firstName" type="text" value={form.firstName} onChange={handleChange} required /><br/>
		
						<label style={{marginRight:17}}>Last Name:</label>
						<input name="lastName" type="text" value={form.lastName} onChange={handleChange} required /><br/>
		
						<label style={{marginRight:17}}>Birthdate:</label>
						<input name="birthday" type="date" value={form.birthday} onChange={handleChange} required /><br/>
						<button style={{margin: 5}} type="submit">Submit Edit</button>
					</form>
					
					<div>
						<p>Programs</p>
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
					</div>

					<button className="delete" onClick={handleDeleteUser}>Delete Attendee</button>
				</div> : null}
		</>
	);
}
