import React, {useCallback, useState} from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

	//Shut up VSCode's typescript linter
	//@ts-ignore
	document.body.style = 'background: black';

	const nav = useNavigate();

	const toHome = () => {
		if (document.getElementById("username_box").value.trim().length !== 0 || document.getElementById("password_box").value.trim().length !== 0){
			nav("/")
		} else {
			document.getElementById("Error").style.color = 'red'
		}
	};

	const [activeComponent, setActiveComponent] = useState("projects");

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);

return (
	<center>
	<div>
	<h1 style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline'}} alt="new"/>
	<hr style={{color:'white'}}></hr>
	<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("User")}>User Login</h2>
	<h2 style={{color:'white', display:'inline'}} onClick={() => modifyActiveComponent("Admin")}>Admin Login</h2>
	<h2 style={{color:'white', display:'inline', marginLeft:260}} onClick={() => modifyActiveComponent("Register")}>Register</h2>
	<br />
	{activeComponent === "User" && 	<div>
									<label style={{color:'white', marginRight:15}}>Username:	</label>
									<input type="textarea" id="username_box" name="username_box"></input>
									<br/>
									<label style={{color:'white', marginRight:17}}>Password:	</label>
									<input type="textarea" id="password_box" name="password_box"></input>
									<br/>
									<label id="Error">Please fill out all fields</label>
									<br/>
									<button onClick={toHome}>Login</button>
									</div>}
	{activeComponent === "Admin" && <div>
									<label style={{color:'white', marginRight:15}}>Username:	</label>
									<input type="textarea" id="username_box" name="username_box"></input>
									<br/>
									<label style={{color:'white', marginRight:17}}>Password:	</label>
									<input type="textarea" id="password_box" name="password_box"></input>
									<br/>
									<label style={{color:'white', marginRight:17}}>Admin Key:	</label>
									<input type="textarea" id="Admin_key" name="Admin_key"></input>
									<br/>
									<label id="Error">Please fill out all fields</label>
									<br/>
									<button onClick={toHome}>Login</button>
									</div>}
	{activeComponent === "Register" && <div>
									<label style={{color:'white', marginRight:15}}>Username:	</label>
									<input type="textarea" id="username_box" name="username_box"></input>
									<br/>
									<label style={{color:'white', marginRight:17}}>Password:	</label>
									<input type="textarea" id="password_box" name="password_box"></input>
									<br/>
									<label style={{color:'white', marginRight:17}}>Admin Key:	</label>
									<input type="textarea" id="Admin_key" name="Admin_key"></input>
									<br/>
									<label id="Error">Please fill out all fields</label>
									<br/>
									<button onClick={toHome}>Login</button>
									</div>}
	</div>
	</center>
);
};

export default Login;
