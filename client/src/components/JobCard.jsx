import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const JobCard = ({ job }) => {
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));

	const handleDelete = async (id) => {
		const condition = window.confirm(
			"Are you sure you want to delete this job post?"
		);
		if (condition) {
			const token = Cookies.get("token");
			const response = await axios.delete(
				`${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/v1/job-posts/delete/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response?.data;
			console.log(data);
			if (data.success) {
				window.location.reload();
			}
		}
	};

	const handleApply = async (id) => {
		const condition = window.confirm(
			"Are you sure you want to apply this job?"
		);
		if (condition) {
			const token = Cookies.get("token");
			const response = await axios.post(
				`http://localhost:8000/api/v1/job-posts/apply/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response?.data;
			if (data.success) {
				navigate(`/greet/${id}`);
			} else {
				alert(data.message);
			}
		}
	};

	const handleView = (id) => {
		if (!user || !user.role) {
			navigate("/login");
			return;
		}
		navigate(`/job/${id}`);
	};

	return (
		<div className="w-100 job-card">
			<h2 className="title">{job.title}</h2>
			<div className="d-flex gap-3">
				<p className="company">{job.company}</p>
				<p className="location">{job.location}</p>
			</div>
			<div className="">
				<p className="salary">Salary : {job.salary}</p>
				<p className="job-type">{job.jjobType}</p>
			</div>
			<div className="mt-2 d-flex justify-content-end gap-1 flex-wrap">
				<button
					onClick={() => handleView(job._id)}
					className="btn btn-primary"
				>
					View
				</button>

				{/* Delete nad Edit button should only be visible to recruiter */}
				{user?.role === "employer" && (
					<>
						<button
							onClick={() => handleDelete(job._id)}
							className="btn btn-danger"
						>
							Delete
						</button>
					</>
				)}

				{/* Apply button should only be visible to applicant */}
				{user?.role === "jobseeker" && (
					<button
						onClick={() => handleApply(job._id)}
						className="btn btn-success"
					>
						Apply
					</button>
				)}
			</div>
		</div>
	);
};

export default JobCard;
