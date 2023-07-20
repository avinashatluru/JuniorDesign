import React from "react";
import { Link } from "react-router-dom";

const Add = () => {

	document.body.style = 'background: black;';

return (
	<div>

	<center>
	<div>
	<h1 style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline', marginRight:100}} alt="new"/>
	</div>
	<hr style={{color:'white'}}></hr>
	<br />

	<ul>
		<li>
		{/* Endpoint to route to Home component */}
		<Link to="/">Home</Link>
		</li>
		<li>
		{/* Endpoint to route to About component */}
		<Link to="/Login">Login</Link>
		</li>
		<li>
		{/* Endpoint to route to Contact Us component */}
		<Link to="/Add">Add</Link>
		</li>
	</ul>
	</center>
	</div>
);
};

export default Add;
