import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import JobCard from "./JobCard";

const JobList = ({ JobPosts = [] }) => {
	return (
		<section className="my-3">
			<h1 className="fs-3 my-2">Job Posts</h1>
			<Container fluid className="">
				<Row className="p-1">
					{JobPosts && JobPosts.length > 0 ? (
						JobPosts.map((job) => (
							<Col key={job._id} lg={4} md={6} sm={12} className="mb-3">
								<JobCard job={job} />
							</Col>
						))
					) : (
						<p className="fs-5 text-black-50">No Job Posts Available</p>
					)}
				</Row>
			</Container>
		</section>
	);
};

export default JobList;
