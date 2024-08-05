import axios from "axios";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Greet = () => {
	const { jobId } = useParams();
	const [job, setJob] = useState(null);

	useEffect(() => {
		// fetch job details using jobId
		const fetchJob = async () => {
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
			const data = response?.data;
      console.log(data)
			if (data.success) {
				setJob(data.data);
			}
		};
		fetchJob();
	}, [jobId]);

	return (
		<div className="w-100 d-flex align-items-center justify-content-center">
			<div className="greet-box d-flex flex-column gap-2">
				<h3 className="text-center">Your Application for <span className="text-primary">{job?.title}</span> at <span className="text-primary">{job?.company}</span> has been successfully sent.</h3>
        <p className="text-center">Company will review your application and get back to you soon.</p>

        {/* button to go back to jobs page */}
        <Link to="/explore" className="btn btn-primary mx-auto">Go to Jobs</Link>
			</div>
		</div>
	);
};

export default Greet;
