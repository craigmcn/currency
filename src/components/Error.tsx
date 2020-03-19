import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IProps {
    error: string
}

export const Error: React.FC<IProps> = ({ error }) => (
    <p className="text--danger">
        <FontAwesomeIcon icon={['far', 'exclamation-triangle']} /> { error }
    </p>
)

export default Error
