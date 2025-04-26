import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/duotone-light-svg-icons/faExclamationTriangle';

interface IErrorProps {
  children: React.ReactNode;
}

export function Error({ children }: IErrorProps): React.JSX.Element {
  return (
    <p className="text--danger">
      <FontAwesomeIcon icon={ faExclamationTriangle } className="m-r-xs" />
      {children}
    </p>
  );
}

export default Error;
