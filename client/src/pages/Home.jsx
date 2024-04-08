import React, {useCallback, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserDisplayHack from "../Components/UserDisplayHack";
import AddUser from "../Components/AddUser";
import Add from "./Add";
import ProgramManagement from "../Components/ProgramManagement";
import ViewAttendance from "../Components/ViewAttendance";
import ManageAttendance from "../Components/ManageAttendance";
import '../Styles/basic.css'

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

	const toRemove = () => (
		nav("/Remove")
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
	const toViewAttendance = () => (
		nav("/ViewAttendance")
	);

	const toExportToCsv = () => (
		nav("/ExportToCsv")
	);

	const [activeComponent, setActiveComponent] = useState("projects");

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);

	async function getAttendees() {
		const response = await fetch("http://localhost:5050/api/attendees/");
		
		if (!response.ok) {
			const message = `An error occurred: ${response.statusText}`;
			window.alert(message);
			return;
		}
		
		const data = await response.json();
		const names = data.map(record => [`${record.firstName} ${record.lastName}`, record._id, record.firstName, record.lastName, record.birthday]);
		setList(names);
	}

	useEffect(() => {
		getAttendees();
	}, []);

return (
	<div>
		<button onClick={toLogin}>Logout</button>
		<button onClick={toUserM}>Attendee Details</button>
		<button onClick={toExportToCsv}>Export to Csv</button>

	<center>
	<div>
		<h1 style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
		<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
		style={{width:50, height:50, display:'inline'}} alt="new"/>
	</div>
		<hr/>
		<br/>
	<div>
		<h2 onClick={() => modifyActiveComponent("Home")}>Home</h2>
		<h2 onClick={() => modifyActiveComponent("Roster")}>Roster</h2>
		<h2 onClick={() => modifyActiveComponent("Attendance")}>Attendance</h2>
		<h2 onClick={() => modifyActiveComponent("Database")}>Database</h2>
		
		<br/>
		{activeComponent === "Home" && <img style={{width:800, height:400}} 
		src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbSEttZC6mbQYJxWtzJLwcdDH7Jb_lP8i0eqLU7W7l&s" alt="kid"/>}
		{activeComponent === "Roster" && <div>	
											<h1 style={{color:'white'}}>ATTENDEES</h1> 
											<div style={{maxHeight:300, width:200}}>
												{list.map(txt => <UserDisplayHack key={txt[1]} data={txt} style={{}} onUserUpdate={getAttendees} /*style={{color:'white'}}*//>)}
											</div>
										 </div>}
		{activeComponent === "Attendance" && <>
											<ManageAttendance/>
											<ViewAttendance/>
											</>}
		{activeComponent === "Database" && 	<>
											<AddUser onUserAdd={getAttendees}/>
											<div>
											<ProgramManagement/>
										   	</div>
											</>}

	</div>
	</center>
	</div>
);
};

export default Home;
