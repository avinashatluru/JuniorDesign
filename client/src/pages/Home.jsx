import React, {useCallback, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserDisplayHack from "../Components/UserDisplayHack";
import AddUser from "../Components/AddUser";
import Add from "./Add";
import ProgramManagement from "../Components/ProgramManagement";
import ViewAttendance from "../Components/ViewAttendance";
import ManageAttendance from "../Components/ManageAttendance";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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

	const [activeComponent, setActiveComponent] = useState("project");

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
	const homeImages = [
       {url:"/Anna.jpg", name: "Anna Jackson", title: "Executive Director"},
	   {url:"/Hayley.png", name: "Hayley McFall", title: "Program Director"},
	   {url:"Catreece.png",name: "Catreece Diggs", title: "Women's Program Coordinator"},
	   {url: "Missy.jpg", name:"Missy MaCray", title: "Site Coordinator"},
	   {url: "Jamari.jpg", name: "Jamari Watts", title: "Program Stuff"},
	   {url: "Eli.jpg", name: "Eli Hargrove", title: "Program Stuff"},
	   {url: "ShaMani.png", name:"ShaMani Pratcher", title: "Program Stuff"},
	   {url: "Mickensie.png", name:"Mickensie Neely", title: "Program Stuff"},
	   {url: "Zemelak.png", name:"Missy Zemelak", title: "Program Stuff"},
	   {url:"Savannah.png", name:"Savannah Blanco", title: "Program Stuff"}

    ];
	const handleImageError = (error, imageUrl) => {
        console.error(`Error loading image: ${imageUrl}`, error);
    };
return (
	<div>
		{/* <button onClick={toLogin}>Logout</button>
		<button onClick={toUserM}>Manage Users</button>
		<button onClick={toExportToCsv}>Export to CSV</button> */}
		 <Stack direction="row" spacing={2} style={{ margin: 20 }}>
                <Button variant="outlined" onClick={toLogin}  sx={{ color: 'white', border: 'none',  fontFamily: '"Times New Roman", serif' , fontweight: 'bold', fontsize: '3rem'}}>Logout</Button>
                {/*<Button variant="outlined" onClick={toUserM} sx={{ color: 'white', border: 'none' ,fontFamily: '"Times New Roman", serif' , fontweight: "bold"}}>Manage Users</Button>*/}
                <Button variant="outlined" onClick={toExportToCsv} sx={{ color: 'white', border: 'none' , fontFamily: '"Times New Roman", serif' , fontweight: "bold"}}>Export to CSV</Button>
        </Stack>

	<center>
	<div>
		<h1 style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
		<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
		style={{width:50, height:50, display:'inline'}} alt="new"/>
	</div>
		<hr/>
		<br/>
	<div>
		<h2 className={`${activeComponent=="Home"? "clickable active" : "clickable"}`} onClick={() => modifyActiveComponent("Home")}>Home</h2>
		<h2 className={`${activeComponent=="Roster"? "clickable active" : "clickable"}`} onClick={() => modifyActiveComponent("Roster")}>Roster</h2>
		<h2 className={`${activeComponent=="Attendance"? "clickable active" : "clickable"}`} onClick={() => modifyActiveComponent("Attendance")}>Attendance</h2>
		<h2 className={`${activeComponent=="Database"? "clickable active" : "clickable"}`} onClick={() => modifyActiveComponent("Database")}>Database</h2>
		
		<br/>

	 {activeComponent === "Home" && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px' }}> {/* Adjust the gap between images here */}
                        {homeImages.map((image, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <img
                                    src={image.url}
                                    alt={`Home Image ${index + 1}`}
                                    style={{ width: '250px', height: '170px', objectFit: 'cover' }}
                                    onError={(error) => handleImageError(error, image.url)}
                                />
                                <p style={{ color: 'white' }}>{image.name}</p>
                                <p style={{ color: 'white' }}>{image.title}</p>
                            </div>
                        ))}
                    </div>
                )}
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
