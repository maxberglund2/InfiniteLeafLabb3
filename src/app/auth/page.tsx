import React from "react";

export default function SignInPage() {
	return (
		<form>
			<div>
				<label htmlFor="username">Username:</label>
				<input type="text" id="username" name="username" />
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input type="password" id="password" name="password" />
			</div>
			<button type="submit">Sign In</button>
		</form>
	);
}
