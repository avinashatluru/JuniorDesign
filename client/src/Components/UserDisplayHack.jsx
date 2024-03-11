import React, { useState, useRef } from "react";

/**
 * Hack UI to allow for the editing & deletion of users from the 
 */
export default function EditableUserNameDisplay({data, style, onUserUpdate}) {

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
	
	const handleClickUserName = () => {
		if (!editing) {
			setEditing(true);
			setStartValue();
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
		console.log("deleting user");
	
		await fetch(`http://localhost:5050/api/attendees/${data[1]}`, {
			method: "DELETE"
		}).catch(error => {
			window.alert("I'm sorry, the database has returned an error from your attempt to delete user \"" + data[0] +"\" id: " + data[1] + ". Please report this with the following error message to the developers. " + error);
			return;
		});

		setEditing(false);
		onUserUpdate();
	}
	
	const NameDisplay = ({name, style}) => {
		return (
			<p style={style}> {name} </p>
		)
	}
	
	return (
		<div>
			<span onClick={handleClickUserName}><NameDisplay name={data[0]} style={{...style, "cursor": "pointer", "font-style": "italic"}}/></span>
			{editing ? 
				<div style={style}>
					<form onSubmit={handleUpdateUser}>
						<label style={{color:'white', marginRight:15}}>First Name:</label>
						<input name="firstName" type="text" value={form.firstName} onChange={handleChange} required /><br/>
		
						<label style={{color:'white', marginRight:17}}>Last Name:</label>
						<input name="lastName" type="text" value={form.lastName} onChange={handleChange} required /><br/>
		
						<label style={{color:'white', marginRight:17}}>Birthdate:</label>
						<input name="birthday" type="date" value={form.birthday} onChange={handleChange} required /><br/>
						<button type="submit">Submit Edit</button>
					</form>
		
					<button onClick={handleDeleteUser}>Delete Attendee</button>
				</div> : null}
		</div>
	);
}