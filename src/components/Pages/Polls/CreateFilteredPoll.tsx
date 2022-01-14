import React from 'react';
import '../../../App.css';
import {FilteredPolls} from "./FilteredPolls";
import {SendNewPoll} from "./SendNewPoll";

export interface CreateFilteredPollProps {
    selectedPollId: number;
    isFiltered: Boolean;
    setIsFiltered: React.Dispatch<React.SetStateAction<Boolean>>;
    setSelectedPollId: React.Dispatch<React.SetStateAction<number>>;
    setFilteredAnswersList: React.Dispatch<React.SetStateAction<string[]>>;
    filteredAnswersList: string[];
    adminName: string;
    adminsPassword: string;
}

export const CreateFilteredPoll : React.FC<CreateFilteredPollProps> = ({
    selectedPollId,
    isFiltered,
    setIsFiltered,
    setSelectedPollId,
    setFilteredAnswersList,
    filteredAnswersList,
    adminName,
    adminsPassword,
}) => {
    return (
        <div className='create-filtered-poll-container'>
            <div>
            <FilteredPolls setSelectedPollId={setSelectedPollId} setFilteredAnswersList={setFilteredAnswersList}
                            adminName={adminName} adminsPassword={adminsPassword}/>
            </div>
            <div>
            <SendNewPoll isFiltered={true} selectedPollId={selectedPollId} filteredAnswersList={filteredAnswersList}
                            adminName={adminName} adminsPassword={adminsPassword}/>
            </div>
        </div>
    )

};

