import React, { useRef, useState } from "react";
import clsx from "clsx";
import { IoEye, IoEyeOff } from "react-icons/io5";

const FormTextarea = ({
	title,
	value,
	onChange,
	placeholder,
	required = false,
	className,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<label className={clsx("d-flex flex-column gap-1 w-100", className)}>
			<span className="w-100">{title}</span>
			<span className="w-100 input-wrapper">
				<textarea
					className="border-0 bg-light w-100 p-2"
                    rows={5}
					style={{ outline: "none" }}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					required={required}
				/>
			</span>
		</label>
	);
};

export default FormTextarea;
