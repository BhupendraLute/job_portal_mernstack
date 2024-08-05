import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "../components";

const Profile = () => {
	const [alert, setAlert] = useState({ message: "", variant: "" });
	const [user, setuser] = useState(null);
	const [resume, setResume] = useState(null);
	const [avatar, setAvatar] = useState(null);
	const [isAvatarLoading, setIsAvatarLoading] = useState(false);
	const [isResumeLoading, setIsResumeLoading] = useState(false);
	useEffect(() => {
		setIsAvatarLoading(true);
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setuser(user);
			setAvatar(user?.avatar);
			setResume(user?.resume);
		}
		setIsAvatarLoading(false);
	}, []);

	const updateAvatar = async (e) => {
		try {
			setIsAvatarLoading(true);
			const formData = new FormData();
			formData.append("avatar", e.target.files[0]);

			const token = Cookies.get("token");
			const response = await axios.patch(
				`${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/v1/users/update-avatar`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);

			const data = response?.data;
			console.log(data);
			if (data.success) {
				localStorage.setItem("user", JSON.stringify(data.data));
				setAlert({ message: data.message, variant: "success" });
				window.location.reload();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsAvatarLoading(false);
		}
	};

	const updateResume = async (e) => {
		try {
			setIsResumeLoading(true);
			const formData = new FormData();
			formData.append("resume", e.target.files[0]);

			const token = Cookies.get("token");
			const response = await axios.patch(
				`${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/v1/users/update-resume`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);

			const data = response?.data;
			console.log(data);
			if (data.success) {
				localStorage.setItem("user", JSON.stringify(data.data));
				setAlert({ message: data.message, variant: "success" });
				window.location.reload();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsResumeLoading(false);
		}
	};

	return (
		<section className="p-3">
			{alert.message && (
				<Alert message={alert.message} variant={alert.variant} />
			)}
			<div className="d-flex flex-column gap-3 align-items-center profile">
				<h1 className="text-center fw-bold">Profile</h1>
				<div className="avatar d-flex align-items-center justify-content-center">
					{isAvatarLoading ? (
						<div className="spinner-border"></div>
					) : (
						<img
							src={avatar || "/assets/images/avatar.png"}
							alt="avatar"
						/>
					)}
					<label htmlFor="avatar-input">
						<img src="/assets/images/edit.jpg" alt="_" />
						<input
							type="file"
							id="avatar-input"
							onChange={updateAvatar}
						/>
					</label>
				</div>

				<div className="d-flex flex-column gap-3">
					<div className="">
						<label>
							Name : {user?.fullName.firstName}{" "}
							{user?.fullName.lastName}
						</label>
					</div>
					<div className="">
						<label>Email : {user?.email}</label>
					</div>
					<div className="">
						<label>User Role : <span className="text-capitalize">{user?.role}</span></label>
					</div>
					<div className="d-flex align-items-center gap-3">
						<label>Resume:</label>
						{resume ? (
							<a
								className="btn btn-primary"
								href={resume}
								target="_blank"
							>
								Open
							</a>
						) : (
							<label>Not Uploaded</label>
						)}
						{resume ? (
							<label
								htmlFor="resume-input"
								className="resume-input"
							>
								<span className="btn btn-primary">
									{isResumeLoading ? "Updating..." : "Update"}
								</span>
								<input
									type="file"
									id="resume-input"
									onChange={updateResume}
								/>
							</label>
						) : (
							<label
								htmlFor="resume-input"
								className="resume-input"
							>
								<span className="btn btn-primary">
									{isResumeLoading
										? "Uploading..."
										: "Uploading"}
								</span>
								<input
									type="file"
									id="resume-input"
									onChange={updateResume}
								/>
							</label>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Profile;
