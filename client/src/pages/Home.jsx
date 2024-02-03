import React, {useCallback, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

	document.body.style = 'background: black;';

	const [list, setList] = useState([]);

	const nav = useNavigate();

	const toLogin = () => (
		nav("/Login")
	);

	const toAdd = () => (
		nav("/Add")
	);

	const [activeComponent, setActiveComponent] = useState("projects");

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);
	
	useEffect(() => {
		async function getRecords() {
			const response = await fetch("http://localhost:5050/record/");
			
			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}
			
			const data = await response.json();
			const names = data.map(record => `${record.firstName} ${record.lastName}`);
			setList(names);
		}

		getRecords();
	}, []);

return (
	<div>
		<button onClick={toLogin}>Logout</button>
		<button onClick={() => modifyActiveComponent("AddUser")}>Add User</button>
	<center>
	<div>
		<h1 style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
		<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
		style={{width:50, height:50, display:'inline', marginRight:100}} alt="new"/>
	</div>
		<hr style={{color:'white'}}></hr>
		<br />
	<div>
		<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Home")}>Home</h2>
		<h2 style={{color:'white', display:'inline'}} onClick={() => modifyActiveComponent("Roster")}>Roster</h2>
		<h2 style={{color:'white', display:'inline', marginLeft:260}} onClick={() => modifyActiveComponent("Database")}>Database</h2>
		<br/>
		{activeComponent === "Home" && <img style={{width:800, height:400}} 
		src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbSEttZC6mbQYJxWtzJLwcdDH7Jb_lP8i0eqLU7W7l&s" alt="kid"/>}
		{activeComponent === "Roster" && <div>	
											<h1 style={{color:'white'}}>ATTENDEES</h1> 
											<div style={{maxHeight:300, width:200, overflow:'auto'}}>
											{list.map(txt => <p style={{color:'white'}}>{txt}</p>)}
											</div>
										 </div>}
		{activeComponent === "Database" && 	<div>
											<button onClick={toAdd}>Add Attendee</button>
										   	</div>}
		{activeComponent === "AddUser" && 	<div>
											<label style={{color:'white', marginRight:15}}>Full Name:	</label>
											<input name="Username" type="text" id="name" required /><br/>

											<label style={{color:'white', marginRight:15}}>Password:	</label>
											<input name="Userpass" type="text" id="userPassword" required /><br/>

											<label style={{color:'white', marginRight:17}}>Authority:		</label>
											<select name="UserType" id="userType" required>
												<option value="Admin">Admin</option>
												<option value="User">User</option>
											</select><br/>
											</div>}
	</div>
	</center>
	</div>
);
};

export default Home;