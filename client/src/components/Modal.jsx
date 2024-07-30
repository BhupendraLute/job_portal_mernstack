import React from "react";

const Modal = ({ show = false, onHide, handleClose, onPrimaryClick, type }) => {
	return (
		<Modal
			show={show}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
		>
			<Modal.Header closeButton>
				<Modal.Title>Modal title</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				This is body
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button onClick={onPrimaryClick} variant="primary">Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default Modal;
