import React, {useCallback, useState} from "react";
import { useNavigate } from "react-router-dom";

function UserManagement() {

    const nav = useNavigate();
    document.body.style = 'background: black';

    const toHome = () => {
		nav("/")
	};

    const [activeComponent, setActiveComponent] = useState("projects");

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);

    return (
	<center>
	<div>
	<h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline'}} alt="new"/>
	<hr style={{color:'white'}}></hr>
	<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Add")}>Add User</h2>
	<h2 style={{color:'white', display:'inline'}} onClick={() => modifyActiveComponent("Remove")}>Remove User</h2>
	<br />
    <br />
	{activeComponent === "Add" && 	<div>
										<label style={{color:'white', marginRight:15}}>Full Name:	</label>
										<input name="Username" type="text" id="name" required /><br/>
										<label style={{color:'white', marginRight:15}}>Password:	</label>
										<input name="Userpass" type="text" id="userPassword" required /><br/>
										<label style={{color:'white', marginRight:17}}>Authority:		</label>
										<select name="UserType" id="userType" required>
											<option value="Admin">Admin</option>
											<option value="User">User</option>
										</select><br/>
										<button type="submitAdd">Add</button>
										</div>}
    {activeComponent === "Remove" && <div>	
										<h1 style={{color:'white'}}>Select user to remove</h1> 
										<div style={{maxHeight:300, width:200, overflow:'auto'}}>
										<label style={{color:'white', marginRight:17}}>Select user:</label>
										<select name="program">
											<option value="">Select a User</option>
										</select><br/>
										<button type="submitRemove">Remove</button>
										</div>
										</div>}
	</div>
	</center>
    );
};

export default UserManagement