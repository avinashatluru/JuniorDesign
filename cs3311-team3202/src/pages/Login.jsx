import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

	document.body.style = 'background: black';

	const nav = useNavigate();

	const toHome = () => (
		nav("/")
	);

return (
	<center>
	<div>
	<h1 style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline'}} alt="new"/>
	<hr style={{color:'white'}}></hr>
	<br />
	<label style={{color:'white'}}>Username:	</label>
	<input type="textarea" name="username_box"></input>
	<br/>
	<label style={{color:'white'}}>Password:	</label>
	<input type="textarea" name="password_box"></input>
	<br/>
	<button onClick={toHome}>Login</button>
	</div>
	</center>
);
};

export default Login;
