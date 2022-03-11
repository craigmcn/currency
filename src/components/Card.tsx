import React from 'react';

interface IProps {
    title: string;
    type?: 'primary' | 'secondary';
}

export const Card: React.FC<IProps> = ({ title, type, children }) => {
    const cardType = type ? ` card--${type}` : '';

    return (
        <div
            className={ `card${cardType} flex__item flex__item--12 flex__item--8-md` }
        >
            <div className="card__title">
                <h2>{ title }</h2>
            </div>
            <div className="card__body">
                { children }
            </div>
        </div>
    );
};

export default Card;
