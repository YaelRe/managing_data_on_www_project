import React from 'react';
import '../../App.css';

export interface ManageAdminsProps {
    adminName: string;
    adminsPassword: string;
}
export const PollResults : React.FC<ManageAdminsProps> = ({
    adminName,
    adminsPassword,
}) => {

      return (
        <div className='header-container'>
        </div>
    )
}
