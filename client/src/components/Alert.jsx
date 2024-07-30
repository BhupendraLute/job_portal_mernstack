import React, { useState, useEffect } from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";

const Alert = ({ message, variant = "success", duration = 3000 }) => {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration]);

	if (!show) {
		return null;
	}

	return (
		<BootstrapAlert
			variant={variant}
			onClose={() => setShow(false)}
			className="position-fixed alert-position"
			dismissible
		>
			{message}
		</BootstrapAlert>
	);
};

export default Alert;
