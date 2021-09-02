import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons/faExclamationTriangle";

interface IProps {
    error: string;
}

export const Error: React.FC<IProps> = ({ error }) => (
    <p className="text--danger">
        <FontAwesomeIcon icon={ faExclamationTriangle } /> {error}
    </p>
);

export default Error;
