import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/duotone-light-svg-icons/faSyncAlt';

export function Loader(): React.JSX.Element {
  return (
    <div className="alert alert--info">
      <div className="alert__text">
        <FontAwesomeIcon icon={ faSyncAlt } spin /> Loading &hellip;
      </div>
    </div>
  );
}

export default Loader;
