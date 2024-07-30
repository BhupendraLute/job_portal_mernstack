import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

const NavbarComponent = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [userToken, setuserToken] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		const token = Cookies.get("token");
		if (token) {
			setIsLoggedIn(true);
			setUser(user);
			setuserToken(token);
		} else {
			setIsLoggedIn(false);
			setUser(null);
			setuserToken(null);
		}
	}, [isLoggedIn, userToken]);

	const handleLogout = async () => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/v1/users/logout",
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userToken}`,
					},
					withCredentials: true,
				}
			);
			const data = response?.data;
			if (data.success) {
				localStorage.removeItem("user");
				setIsLoggedIn(false);
				setUser(null);
				Cookies.remove("token");
				// setAlert({ message: data.message, variant: "success" });
				setTimeout(() => {
					navigate("/");
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Navbar
			fixed="top"
			expand="md"
			className="bg-dark navbar-dark"
			style={{ zIndex: "90" }}
		>
			<Container fluid>
				<Navbar.Brand className="fw-bold">Job Portal</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Link to={"/"} className="nav-link">
							Home
						</Link>

						{user && user.role === "employer" ? (
							<Link to={"/dashboard"} className="nav-link">
								Dashboard
							</Link>
						) : (
							<Link to={"/explore"} className="nav-link">
								explore
							</Link>
						)}
					</Nav>
					<Nav>
						{isLoggedIn ? (
							<>
								{user && (
									<div className="profileAvatar d-none d-md-block me-3 bg-light">
										<Link to={"/user/profile"}>
											<img
												src={
													user?.avatar
														? user.avatar
														: "/assets/images/avatar.jpg"
												}
												alt="_"
												className="avatar-image"
											/>
										</Link>
									</div>
								)}
								{user && (
									<Link
										to={"/user/profile"}
										className="nav-link d-block d-md-none mb-1"
										style={{ width: "fit-content" }}
									>
										Profile
									</Link>
								)}
								<button
									className="btn btn-danger"
									style={{ width: "fit-content" }}
									onClick={handleLogout}
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link to={"/login"} className="nav-link">
									Login
								</Link>
								<Link to={"/signup"} className="nav-link">
									Register
								</Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavbarComponent;
