import { useState } from "react";
import React from "react";
import { Container } from "react-bootstrap";
import { Alert, FormInput, FormTextarea } from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PostJob = () => {
	const [formData, setFormData] = useState({
		title: "",
		company: "",
		description: "",
		jobType: "",
		salary: "",
		location: "",
		applicationDeadline: "",
	});

	const [alert, setAlert] = useState({ message: "", variant: "" });

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = Cookies.get("token");
			const response = await axios.post(
				`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/job-posts/create`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response?.data;
			if (data.success) {
				setAlert({ message: data.message, variant: "success" });
				setTimeout(() => {
					navigate("/dashboard");
				}, 1000);
			}
		} catch (error) {
			console.log(error);
			// if (error.response) {
			// 	if (
			// 		error.response.data.includes("User does not exist") ||
			// 		error.response.data.includes("Invalid user credentials")
			// 	) {
			// 		setAlert({
			// 			message: "Invalid email or password",
			// 			variant: "danger",
			// 		});
			// 	} else {
			// 		setAlert({
			// 			message:
			// 				error.response.data ||
			// 				"Login failed. Please try again.",
			// 			variant: "danger",
			// 		});
			// 	}
			// } else if (error.request) {
			// 	console.log(error.request);
			// 	setAlert({
			// 		message:
			// 			"No response received from the server. Please check your internet connection.",
			// 		variant: "danger",
			// 	});
			// } else {
			// 	console.log("Error", error.message);
			// 	setAlert({
			// 		message:
			// 			"An error occurred while sending the request. Please try again later.",
			// 		variant: "danger",
			// 	});
			// }
		} finally {
			setTimeout(() => {
				setAlert({ message: "", variant: "" });
			}, 1000);
			setFormData({
				title: "",
				company: "",
				description: "",
				jobType: "",
				salary: "",
				location: "",
				applicationDeadline: "",
			});
		}
	};

	return (
		<Container className="p-2 w-100">
			{alert.message && (
				<Alert message={alert.message} variant={alert.variant} />
			)}
			<div className="p-1 border-bottom border-2 border-dark">
				<h1 className="fs-4 fw-bold">Post Job</h1>
			</div>
			<form onSubmit={handleSubmit} className="dashboard-form-container">
				<div className="my-3 d-flex flex-column gap-2">
					<div className="d-md-flex gap-3">
						<FormInput
							type="text"
							title={"Job Title"}
							placeholder={"title"}
							value={formData.title}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
							required
						/>
						<FormInput
							type="text"
							title={"Location"}
							placeholder={"location"}
							value={formData.location}
							onChange={(e) =>
								setFormData({
									...formData,
									location: e.target.value,
								})
							}
							required
						/>
					</div>

					<div className="d-md-flex gap-3">
						<FormInput
							type="text"
							title={"Company"}
							placeholder={"company"}
							value={formData.company}
							onChange={(e) =>
								setFormData({
									...formData,
									company: e.target.value,
								})
							}
							required
						/>

						<FormInput
							type="text"
							title={"Job Type"}
							placeholder={"fulltime, parttime, internship"}
							value={formData.jobType}
							onChange={(e) =>
								setFormData({
									...formData,
									jobType: e.target.value,
								})
							}
							required
						/>
					</div>

					<div className="d-md-flex gap-3">
						<FormInput
							type="text"
							title={"Salary"}
							placeholder={"salary"}
							value={formData.salary}
							onChange={(e) =>
								setFormData({
									...formData,
									salary: e.target.value,
								})
							}
							required
						/>
						<FormInput
							type="date"
							title={"Application Deadline"}
							value={formData.applicationDeadline}
							onChange={(e) =>
								setFormData({
									...formData,
									applicationDeadline: e.target.value,
								})
							}
							required
						/>
					</div>

					<div className="d-md-flex gap-3">
						<FormTextarea
							title={"Description"}
							placeholder={"description"}
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							className="mb-3"
							required
						/>
					</div>

					<div className="">
						<button
							type="submit"
							className="btn btn bg-success text-white px-4"
						>
							Post
						</button>
					</div>
				</div>
			</form>
		</Container>
	);
};

export default PostJob;
