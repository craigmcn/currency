import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/pro-regular-svg-icons/faSyncAlt";

export const Loader = (): JSX.Element => (
    <div className="alert alert--info">
        <div className="alert__text">
            <FontAwesomeIcon icon={ faSyncAlt } spin /> Loading &hellip;
        </div>
    </div>
);

export default Loader;
