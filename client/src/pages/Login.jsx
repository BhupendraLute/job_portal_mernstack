import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Alert, FormInput } from "../components";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [alert, setAlert] = useState({ message: "", variant: "" });

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:8000/api/v1/users/login",
				formData,
				{ withCredentials: true }
			);
			const data = response?.data;
			if (data.success) {
				const loggedInUser = data?.data.user;
				Cookies.set("token", data?.data.accessToken, {
					expires: 5,
				});
				localStorage.setItem("user", JSON.stringify(loggedInUser));
				setAlert({ message: data.message, variant: "success" });
				setTimeout(() => {
					navigate("/");
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			console.log(error);
			if (error.response) {
				if (
					error.response.data.includes("User does not exist") ||
					error.response.data.includes("Invalid user credentials")
				) {
					setAlert({
						message: "Invalid email or password",
						variant: "danger",
					});
				} else {
					setAlert({
						message:
							error.response.data ||
							"Login failed. Please try again.",
						variant: "danger",
					});
				}
			} else if (error.request) {
				console.log(error.request);
				setAlert({
					message:
						"No response received from the server. Please check your internet connection.",
					variant: "danger",
				});
			} else {
				console.log("Error", error.message);
				setAlert({
					message:
						"An error occurred while sending the request. Please try again later.",
					variant: "danger",
				});
			}
		} finally {
			setTimeout(() => {
				setAlert({ message: "", variant: "" });
			}, 3000);

			setFormData({
				email: "",
				password: "",
			});
		}
	};

	return (
		<Container className="h-100 pt-3 d-flex flex-column align-items-center justify-content-center gap-2">
			{alert.message && (
				<Alert message={alert.message} variant={alert.variant} />
			)}
			<div className="text-center">
				<h2>
					<Link to={"/"} className="text-black fw-bold">
						Job Portal
					</Link>
				</h2>
				<p>
					Welcome back to the best job seeking platform. Here dreams
					become true.
				</p>
				<h1 className="text-black fw-bold">Login Your Account</h1>
			</div>
			<form
				onSubmit={handleSubmit}
				className="w-100 d-flex flex-column align-items-center justify-content-center gap-2"
			>
				<div className="container-lg d-flex flex-column flex-lg-row align-items-center justify-content-center gap-3 gap-lg-5">
					<div
						className="d-flex flex-column gap-3 w-100"
						style={{ maxWidth: "500px" }}
					>
						<FormInput
							type="email"
							title={"Email"}
							placeholder={"email"}
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							required
						/>
						<FormInput
							type="password"
							title={"Password"}
							placeholder={"password"}
							value={formData.password}
							onChange={(e) => {
								setFormData({
									...formData,
									password: e.target.value,
								});
							}}
							required
						/>
					</div>
				</div>
				<button
					type="submit"
					className="py-1 px-3 mt-2 btn btn-success"
					style={{ width: "fit-content" }}
				>
					Login
				</button>

				<p className="mt-2">
					Don't have an account?{" "}
					<Link to={"/signup"}>create account</Link>
				</p>
			</form>
		</Container>
	);
};

export default Login;
