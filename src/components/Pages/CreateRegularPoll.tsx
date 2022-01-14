import React from 'react';
import '../../App.css';
import {SendNewPoll} from "./SendNewPoll";

export interface CreateRegularPollProps {
    isFiltered: Boolean;
    setIsFiltered: React.Dispatch<React.SetStateAction<Boolean>>;
    adminName: string;
    adminsPassword: string;
}

export const CreateRegularPoll : React.FC<CreateRegularPollProps> = ({
    isFiltered,
    setIsFiltered,
    adminName,
    adminsPassword,
}) => {
    setIsFiltered(false);
    return (
        <div className='creat-regular-poll-container'>
            <SendNewPoll isFiltered={isFiltered} selectedPollId={-1} filteredAnswersList={[]}
                            adminName={adminName} adminsPassword={adminsPassword}/>
        </div>
    )

};


