import React from 'react';

export const StatCard = ({ title, value, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100',
        purple: 'text-purple-600 bg-purple-100'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[0]} mt-2`}>
                        {value}
                    </p>
                </div>
                <div className={`${colorClasses[color].split(' ')[1]} p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};