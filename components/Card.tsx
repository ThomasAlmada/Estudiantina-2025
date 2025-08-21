import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {title && (
        <div className="p-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
                {icon && <div className="mr-3 text-primary">{icon}</div>}
                <h2 className="text-lg font-semibold text-dark tracking-wide">{title}</h2>
            </div>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;