import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {

	//Shut up VSCode's typescript linter
	//@ts-ignore
	document.body.style = 'background: black;';

	const navigate = useNavigate();

	const toLogin = () => (
		navigate("/Login")
	);

	const toHome = () => (
		navigate("/")
	);

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

		await fetch("http://localhost:5050/api/attendees", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form),
		})
		.catch(error => {
			window.alert(error);
			return;
		});
		setForm({ firstName: "", lastName: "", birthday: ""});
		navigate("/AddConfirm");
	}

	return (
		<div>
			<button onClick={() => navigate("/Login")}>Logout</button>
			<center>
				<div>
					<h1 onClick={() => navigate("/")} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
					<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
					style={{width:50, height:50, display:'inline', marginRight:100}} alt="new"/>
				</div>
				<hr style={{color:'white'}}></hr>
				<br />
				<form onSubmit={handleSubmit}>
					<label style={{color:'white', marginRight:15}}>First Name:</label>
					<input name="firstName" type="text" value={form.firstName} onChange={handleChange} required /><br/>

					<label style={{color:'white', marginRight:17}}>Last Name:</label>
					<input name="lastName" type="text" value={form.lastName} onChange={handleChange} required /><br/>

					<label style={{color:'white', marginRight:17}}>Birthdate:</label>
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
				</form>
			</center>
		</div>
	);
};

export default Add;
