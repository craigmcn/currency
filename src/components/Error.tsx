import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';

interface IErrorProps {
    children: React.ReactNode;
}

export const Error: React.FC<IErrorProps> = ({ children }) => (
    <p className="text--danger">
        <FontAwesomeIcon icon={ faExclamationTriangle } className="m-r-xs" />
        {children}
    </p>
);

export default Error;
