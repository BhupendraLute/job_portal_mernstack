import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Offcanvas } from "react-bootstrap";
import { FaAnglesRight } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { FaHome, FaPlus } from "react-icons/fa";

const EmployerDashboardLinks = [
	{
		path: "/dashboard",
		title: "Main",
		icon: <FaHome />,
	},
	{
		path: "/dashboard/post-job",
		title: "Post Job",
		icon: <FaPlus />,
	},
];

const Dashboard = ({ children }) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (!user) {
			window.location.href = "/login";
		} else if (user.role !== "employer") {
			window.location.href = "/";
		}
	}, []);

	return (
		<Container fluid className="dashboard-container">
			<Row className="h-100">
				<Col
					md={3}
					lg={2}
					className="bg-dark text-light position-fixed top-0 start-0 h-100 d-none d-md-block"
				>
					<Nav
						className="flex-column gap-3"
						style={{ marginTop: "4rem" }}
					>
						{EmployerDashboardLinks.map((link, index) => (
							<Link
								key={index}
								to={link.path}
								className="d-flex gap-2 align-items-center dashboard-links fs-6 fw-semibold text-light w-100 ps-3"
							>
								{link.icon}
								<span>{link.title}</span>
							</Link>
						))}
					</Nav>
				</Col>

				<Col md={9} lg={10} className="ms-auto">
					<button
						aria-controls="offcanvasNavbar"
						onClick={handleShow}
						className="position-fixed border-0 text-center bg-dark text-light rounded-circle d-block d-md-none"
						style={{
							width: "40px",
							height: "40px",
							top: "3.5rem",
							right: "1rem",
							zIndex: "80",
						}}
					>
						<FaAnglesRight />
					</button>

					<Offcanvas show={show} onHide={handleClose}>
						<Offcanvas.Header className="bg-dark text-light btn-close-white">
							<Offcanvas.Title>Dashboard</Offcanvas.Title>
							<button
								type="button"
								onClick={handleClose}
								className="btn-close btn-close-white"
								aria-label="Close"
							></button>
						</Offcanvas.Header>

						<Offcanvas.Body className="bg-dark text-light">
							<Nav className="flex-column gap-3 mt-3">
								{EmployerDashboardLinks.map((link, index) => (
									<Link
										key={index}
										to={link.path}
										onClick={handleClose}
										className="d-flex gap-2 align-items-center dashboard-links fs-6 fw-semibold text-light w-100 ps-3"
									>
										{link.icon}
										<span>{link.title}</span>
									</Link>
								))}
							</Nav>
						</Offcanvas.Body>
					</Offcanvas>

					<div className="pt-4 pt-md-1">
						<Outlet />
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;
