import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const ApplicationCard = ({ applicantId, applicationId, resume }) => {
	const token = Cookies.get("token");
	const [applicant, setApplicant] = useState(null);
	useEffect(() => {
		const fetchApplicantData = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/v1/users/profile/${applicantId}`,
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
					setApplicant(data.data);
				}
			} catch (error) {
				console.error("Error fetching applicant data:", error);
			}
		};

		fetchApplicantData();
	}, [applicantId]);

	return (
		<>
			{applicant ? (
				<div className="w-100 job-card">
					<div className="d-flex align-items-center gap-2">
						<img
							className="mb-2"
							style={{
								height: "50px",
								width: "50px",
								borderRadius: "50%",
								border: "1px solid #fff",
								objectFit: "cover",
								objectPosition: "center",
								padding: "2px",
								boxShadow: "0 0 5px black",
							}}
							src={applicant.avatar}
							alt="avatar not found"
						/>
						<div className="d-flex flex-column">
							<label className="mb-0 fs-5">
								{`${applicant.fullName.firstName} ${applicant.fullName.lastName}`}
							</label>
							<label className="mb-0 fs-6 text-black-50">
								{applicant.email}
							</label>
						</div>
					</div>

					<div className="mt-2 mb-0 d-flex align-items-center justify-content-center gap-2">
						<button
							onClick={() => window.open(resume, "_blank")}
							className="btn btn-primary"
						>
							Resume
						</button>
					</div>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
};

export default ApplicationCard;
