import React from 'react'

type TProps = {
    title: string
    type?: 'primary' | 'secondary' | null
}

export const Card: React.FC<TProps> = ({ title, type, children }) => (
    <div className={ `card${type ? ` card--${type}` : ''} flex__item flex__item--12 flex__item--8-md` }>
        <div className="card__title">
            <h2>{ title }</h2>
        </div>
        <div className="card__body">
            { children }
        </div>
    </div>
)

export default Card