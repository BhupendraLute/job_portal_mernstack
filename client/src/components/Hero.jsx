import React, { useState } from "react";
import Searchbar from "./Searchbar";
import { Link } from "react-router-dom";

const Hero = () => {
	return (
		<div
			className="bg-image"
			style={{
				backgroundImage: "url('/assets/images/hero-bg.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				height: "calc(100vh - 3.4rem)",
			}}
		>
			<div
				className="mask p-3"
				style={{
					backgroundColor: "rgba(0, 0, 0, 0.6)",
					height: "100%",
				}}
			>
				<div className="d-flex justify-content-center align-items-center h-100">
					<div className="text-white text-center">
						<h1 className="mb-3">Find Your Dream Job</h1>
						<h4 className="mb-4">
							Search from thousands of job opportunities
						</h4>
						<Link to="/explore" className="btn btn-success fw-bold">
							Explore Now
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
