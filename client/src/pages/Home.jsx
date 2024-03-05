import React, {useCallback, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

	//Shut up VSCode's typescript linter
	//@ts-ignore
	document.body.style = 'background: black;';

	const [list, setList] = useState([]);

	const nav = useNavigate();

	const toLogin = () => (
		nav("/Login")
	);

	const toAdd = () => (
		nav("/Add")
	);

	const toUserM = () => (
		nav("/UserManagement")
	);

	const toProgramM = () => (
		nav("/ProgramManagement")
	);
	const toAttendance = () => (
		nav("/Attendance")
	);

	const [activeComponent, setActiveComponent] = useState("projects");

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);
	
	useEffect(() => {
		async function getAttendees() {
			const response = await fetch("http://localhost:5050/api/attendees/");
			
			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}
			
			const data = await response.json();
			const names = data.map(attendee => [`${attendee.firstName} ${attendee.lastName}`, attendee._id]);
			setList(names);
		}

		getAttendees();
	}, []);

return (
	<div>
		<button onClick={toLogin}>Logout</button>
		<button onClick={toUserM}>Manage Users</button>
		<button onClick={toProgramM}>Manage Programs</button>
		<button onClick={toAttendance}>Take Attendance</button>

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
											{list.map(txt => <p key={txt[1]} style={{color:'white'}}>{txt[0]}</p>)}
											</div>
										 </div>}
		{activeComponent === "Database" && 	<div>
											<button onClick={toAdd}>Add Attendee</button>
										   	</div>}
	</div>
	</center>
	</div>
);
};

export default Home;
