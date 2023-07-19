import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

const nav = useNavigate();

const toHome = () => (
	nav("/")
);

return (
	<div>
	<h1>Login Page</h1>
	<button onClick={toHome}>Login</button>
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

export default Login;
