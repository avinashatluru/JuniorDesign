import React from "react";
import { Link } from "react-router-dom";

const Add = () => {
return (
	<div>
	<h1>Add Attendee Page</h1>
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
	</div>
);
};

export default Add;
