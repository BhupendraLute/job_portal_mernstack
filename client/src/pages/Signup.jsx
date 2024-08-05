import React, { useState } from "react";
import { Alert, FormInput } from "../components";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import axios from "axios";

const Signup = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		dob: "",
		role: "",
	});

	const [alert, setAlert] = useState({ message: "", variant: "" });

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/users/register`,
				formData
			);
			console.log("response:", response);
			const data = response?.data;
			console.log("data:", data);
			if (data.success) {
				setAlert({ message: data.message, variant: "success" });
			}
		} catch (error) {
			console.log(error);
			if (error.response) {
				if (
					error.response.data.includes(
						"User with email or username already exists"
					)
				) {
					setAlert({
						message:
							"A user with the provided email or username already exists.",
						variant: "danger",
					});
				} else {
					setAlert({
						message:
							error.response.data ||
							"Registration failed. Please try again.",
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
				firstName: "",
				middleName: "",
				lastName: "",
				username: "",
				email: "",
				password: "",
				dob: "",
				role: "",
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
					Welcome to the best job seeking platform. Here dreams
					becomes true.
				</p>
				<h1 className="text-black fw-bold">Create New Account</h1>
			</div>
			<form
				onSubmit={handleSubmit}
				className="w-100 d-flex flex-column align-items-center justify-content-center gap-2"
			>
				<div className="container-lg d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 gap-lg-5">
					<div className="w-100 d-flex flex-column gap-3">
						<FormInput
							type="text"
							title={"First Name"}
							placeholder={"first name"}
							value={formData.firstName}
							onChange={(e) =>
								setFormData({
									...formData,
									firstName: e.target.value,
								})
							}
							required
						/>
						<FormInput
							type="text"
							title={"Middle Name"}
							placeholder={"middle name"}
							value={formData.middleName}
							onChange={(e) =>
								setFormData({
									...formData,
									middleName: e.target.value,
								})
							}
							required
						/>
						<FormInput
							type="text"
							title={"Last Name"}
							placeholder={"last name"}
							value={formData.lastName}
							onChange={(e) =>
								setFormData({
									...formData,
									lastName: e.target.value,
								})
							}
							required
						/>
						<FormInput
							type="text"
							title={"User Type"}
							placeholder={
								"jobseeker or employer (please type exact type)"
							}
							value={formData.role}
							onChange={(e) =>
								setFormData({
									...formData,
									role: e.target.value,
								})
							}
							required
						/>
					</div>
					<div className="w-100 d-flex flex-column gap-3">
						<FormInput
							type="text"
							title={"Username"}
							placeholder={"username"}
							value={formData.username}
							onChange={(e) =>
								setFormData({
									...formData,
									username: e.target.value,
								})
							}
							required
						/>
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
						<FormInput
							type="date"
							title={"Date Of Birth"}
							value={formData.dob}
							onChange={(e) =>
								setFormData({
									...formData,
									dob: e.target.value,
								})
							}
							required
						/>
					</div>
				</div>
				<button
					type="submit"
					className="py-1 px-3 mt-2 btn btn-success"
					style={{ width: "fit-content" }}
				>
					Signup
				</button>

				<p className="mt-2">
					already have an account? <Link to={"/login"}>login</Link>
				</p>
			</form>
		</Container>
	);
};

export default Signup;
