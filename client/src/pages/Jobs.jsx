import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { JobList, Searchbar } from "../components";
import axios from "axios";
import Cookies from "js-cookie";

const JobsPage = () => {
	const [searchValue, setSearchValue] = useState("");
	const [JobPosts, setJobPosts] = useState([]);

	const handleSearch = async (e) => {
		e.preventDefault();
		const token = Cookies.get("token");
		const response = await axios.get(
			`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/job-posts/search`,
			{
				params: { q: searchValue, page: 1, limit: 10 },
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const data = response.data;
		if (data.success === true) {
			setJobPosts(data.data.jobs);
		}
	};

	useEffect(() => {
		const fetchJobPosts = async () => {
			const token = Cookies.get("token");
			const response = await axios.get(
				`${import.meta.env.BACKEND_API_BASE_URL}/api/v1/job-posts/search`,
				{
					params: { q: searchValue, page: 1, limit: 10 },
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = response.data;
			if (data.success === true) {
				setJobPosts(data.data.jobs);
			}
		};
		fetchJobPosts();
	}, []);

	return (
		<Container>
			<Row className="p-3 border-bottom" style={{ height: "45vh" }}>
				<Col
					lg={6}
					md={8}
					sm={12}
					className="d-flex flex-column justify-content-center align-items-center gap-3 mx-auto"
				>
					<h1 className="text-center fw-bold">
						Here you can find jobs relavent to you
					</h1>
					<div className="w-100">
						<Searchbar
							placeholder="Job title or keywords"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							onSubmit={handleSearch}
						/>
					</div>
				</Col>
			</Row>

			<div className="p-2">
				<JobList JobPosts={JobPosts} />
			</div>
		</Container>
	);
};

export default JobsPage;
