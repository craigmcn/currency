import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Loader: React.FC = () => (
    <div className="alert alert--info">
        <div className="alert__text"><FontAwesomeIcon icon={['far', 'sync-alt']} spin /> Loading &hellip;</div>
    </div>
)

export default Loader
