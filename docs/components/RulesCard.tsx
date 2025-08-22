import React from 'react';
import Card from './Card';
import { RULES } from '../constants';

const RulesCard: React.FC = () => (
    <Card title="Reglamento Principal">
       <ul className="space-y-3">
           {RULES.map((rule, index) => (
               <li key={index} className="flex items-start text-gray-700">
                <svg className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{rule}</span>
               </li>
           ))}
       </ul>
    </Card>
);

export default RulesCard;