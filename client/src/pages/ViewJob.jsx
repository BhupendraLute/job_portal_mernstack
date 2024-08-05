import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ApplicationCard } from "../components";

const ViewJob = () => {
	const { jobId } = useParams();
	const [jobPost, setJobPost] = useState(null);
	const [applications, setApplications] = useState([]);
	const user = JSON.parse(localStorage.getItem("user"));

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchJob() {
			const token = Cookies.get("token");
			const response = await axios.get(
				`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/job-posts/get/${jobId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response.data;
			setJobPost(data.data);
			if (data.data.applications) {
				setApplications(data.data.applications);
			}
		}
		fetchJob();
	}, []);

	const handleDelete = async (id) => {
		const condition = window.confirm(
			"Are you sure you want to delete this job post?"
		);
		if (condition) {
			const token = Cookies.get("token");
			const response = await axios.delete(
				`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/job-posts/delete/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response?.data;
			if (data.success) {
				navigate("/dashboard");
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
				`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/job-posts/apply/${id}`,
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

	return (
		<Container className="my-5">
			{jobPost && (
				<>
					<div className="bg-white p-4 rounded-3">
						<h2 className="fs-5">Job Title: {jobPost.title}</h2>
						<p className="fs-6">Company: {jobPost.company}</p>
						<p className="fs-6">Location: {jobPost.location}</p>
						<p className="fs-6">
							Job Type:{" "}
							<span className="text-capitalize">
								{jobPost.jobType}
							</span>
						</p>
						<p className="fs-6">Salary: {jobPost.salary}</p>
						<div className="fs-6 d-flex gap-2">
							<span
								style={{ width: "fit-content", flexShrink: 0 }}
							>
								Job Description:
							</span>
							<p className="text-break">{jobPost.description}</p>
						</div>

						<div className="mt-3 d-flex align-items-center justify-content-center">
							{user.role === "employer" && (
								<button
									className="btn btn-danger"
									onClick={() => handleDelete(jobPost._id)}
								>
									Delete
								</button>
							)}
							{user.role === "jobseeker" && (
								<button
									className="btn btn-primary"
									onClick={() => handleApply(jobPost._id)}
								>
									Apply
								</button>
							)}
						</div>
					</div>
					{user.role === "employer" && (
						<>
							{applications.length > 0 ? (
								<div className="mt-4">
									<h2>Job Applications</h2>
									<Container fluid className="">
										<Row className="p-1">
											{applications.map((application) => (
												<Col
													lg={6}
													md={6}
													sm={12}
													key={application._id}
													className="mb-3"
												>
													<ApplicationCard
														applicationId={
															application._id
														}
														applicantId={
															application.applicant
														}
														resume={
															application.resume
														}
													/>
												</Col>
											))}
										</Row>
									</Container>
								</div>
							) : (
								<h3 className="mt-4 text-center text-black-50">
									No applications yet
								</h3>
							)}
						</>
					)}
				</>
			)}
		</Container>
	);
};

export default ViewJob;
