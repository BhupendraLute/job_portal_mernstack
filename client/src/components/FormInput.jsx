import React, { useRef, useState } from "react";
import clsx from "clsx";
import { IoEye, IoEyeOff } from "react-icons/io5";

const FormInput = ({
	title,
	value,
	onChange,
	type = "text",
	placeholder,
	required = false,
	className,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputRef = useRef();

    const handlePasswordVisibilityToggle = () => {
        setShowPassword(!showPassword);
		inputRef.current.type = !showPassword ? "text" : "password";
    } 
	return (
		<label className={clsx("d-flex flex-column gap-1 w-100", className)}>
			<span className="w-100">{title}</span>
			<span className="w-100 input-wrapper">
				<input
					ref={inputRef}
					type={type}
					className="border-0 bg-light w-100"
					style={{ outline: "none" }}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					required={required}
				/>
				{type === "password" && (
					<button
						type="button"
						onClick={handlePasswordVisibilityToggle}
					>
						{showPassword ? <IoEye /> : <IoEyeOff />}
					</button>
				)}
			</span>
		</label>
	);
};

export default FormInput;
