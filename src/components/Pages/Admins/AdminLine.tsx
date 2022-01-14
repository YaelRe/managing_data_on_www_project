import React from 'react';
import '../../../App.css';

export interface AdminLineProps {
    admin: string,
}

export const AdminLine: React.FC<AdminLineProps> = ({
    admin,
}) => {

    return (
            <div className='admin-line'>
                <h4 style={{padding: "10px 16px", fontWeight:"400", fontSize: "20px"}}> {admin} </h4>
            </div>
    );
};