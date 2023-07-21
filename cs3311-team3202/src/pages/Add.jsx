import React from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {

	document.body.style = 'background: black;';

	const nav = useNavigate();

	const toLogin = () => (
		nav("/Login")
	);

	const toHome = () => (
		nav("/")
	);

	const make = () => {
		if (document.getElementById("fname").value.trim().length !== 0 || 
			document.getElementById("lname").value.trim().length !== 0 ||
			document.getElementById("bday").value.trim().length !== 0){
			nav("/AddConfirm");
		} else {
			document.getElementById("Error").style.color = 'red';
		}
	};

return (
	<div>
		<button onClick={toLogin}>Logout</button>
	<center>
	<div>
	<h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline', marginRight:100}} alt="new"/>
	</div>
	<hr style={{color:'white'}}></hr>
	<br />
	<label style={{color:'white', marginRight:15}}>First Name:	</label>
	<input type="textarea" id="fname"></input>
	<br/>
	<label style={{color:'white', marginRight:17}}>Last Name:	</label>
	<input type="textarea" id="lname"></input>
	<br/>
	<label style={{color:'white', marginRight:17}}>Birthdate:	</label>
	<input type="textarea" id="bday"></input>
	<br/>
	<label style={{color:'white', marginRight:17}}  >Program:	</label>
	<select id="pgram">
		<option>After School</option>
		<option>Summer Camp</option>
		<option>Spiritual Developement</option>
		<option>Summer Staff</option>
		<option>Family Events</option>
	</select>
	<br/>
	<label style={{color:'white', marginRight:17}}>        Site:	</label>
	<select id="pgram">
		<option>North Avenue</option>
	</select>
	<br/>
	<label id="Error">Please fill out all fields</label>
	<br/>
	<button onClick={make}>Add Attendee</button>
	</center>
	</div>
);
};

export default Add;
