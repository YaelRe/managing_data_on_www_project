import React from 'react';
import '../App.css';

export interface AdminLineProps {
    admin: string,
}

export const AdminLine: React.FC<AdminLineProps> = ({
    admin,
}) => {

    return (
            <div className='admin-line'>
                <h4> {admin} </h4>
            </div>
    );
};