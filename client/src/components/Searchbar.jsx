import clsx from "clsx";
import React from "react";

const Searchbar = ({ placeholder, value, onChange, onSubmit = () => {}, className }) => {
	return (
		<form onSubmit={onSubmit} className={clsx("input-group mb-3", className)}>
			<input
				type="text"
				className="form-control"
				placeholder={placeholder}
				aria-label={placeholder}
				aria-describedby="search-btn"
				style={{ outline: "none" }}
				value={value}
				onChange={onChange}
			/>
			<button
				className="btn btn-primary"
				type="submit"
				id="search-btn"
			>
				Search
			</button>
		</form>
	);
};

export default Searchbar;
