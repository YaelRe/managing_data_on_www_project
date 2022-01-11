import React from 'react';
import '../../App.css';
import {SendNewPoll} from "./SendNewPoll";

export interface CreateRegularPollProps {
    isFiltered: Boolean;
    setIsFiltered: React.Dispatch<React.SetStateAction<Boolean>>;
}
export const CreateRegularPoll : React.FC<CreateRegularPollProps> = ({
    isFiltered,
    setIsFiltered,
}) => {
    setIsFiltered(false);
    return (
        <div className='creat-regular-poll-container'>
            <SendNewPoll isFiltered={isFiltered} selectedPollId={-1} filteredAnswersList={[]} />
        </div>
    )

};


