import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { JobList } from "../components";
import Cookies from "js-cookie";

const DashboardMain = () => {
	const [alert, setAlert] = useState({ message: "", variant: "" });
	const [JobPosts, setJobPosts] = useState([]);

	useEffect(() => {
		const fetchJobPosts = async () => {
			const token = Cookies.get("token");
			const response = await axios.get(
				`http://localhost:8000/api/v1/job-posts/get-my-posts`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response.data;
			if (data.success === true) {
				setJobPosts(data.data);
			}
		};
		fetchJobPosts();
	}, []);

	return (
		<div>
			<Container className="p-2 w-100">
				{alert.message && (
					<Alert message={alert.message} variant={alert.variant} />
				)}
				<div className="p-2">
					<JobList JobPosts={JobPosts} />
				</div>
			</Container>
		</div>
	);
};

export default DashboardMain;
