import React from 'react';
import '../../App.css';
import { LogInPage } from './LogInPage';
import { ManageAdmins } from './ManageAdmins';
import {CreateFilteredPoll} from "./CreateFilteredPoll";
import {CreateRegularPoll} from "./CreateRegularPoll";
import {PollResults} from "./PollResults";

export interface MainPageLayoutProps {
    loggedIn: Boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
    page: number
}
export const MainPageLayout: React.FC<MainPageLayoutProps> = ({
    loggedIn,
    setLoggedIn,
    page,
}) => {

    const [selectedPollId, setSelectedPollId] = React.useState<number>(-1);
    const [filteredAnswersList, setFilteredAnswersList] = React.useState<string[]>([]);
    const [isFiltered, setIsFiltered] = React.useState<Boolean>(false);

    if(loggedIn){
        switch(page) {
            case 0:
                return < PollResults />;
            case 1:
                return <CreateRegularPoll isFiltered={isFiltered} setIsFiltered={setIsFiltered}/>;
            case 2:
                return <CreateFilteredPoll selectedPollId={selectedPollId} setSelectedPollId={setSelectedPollId}
                                           filteredAnswersList={filteredAnswersList} setFilteredAnswersList={setFilteredAnswersList}
                                           isFiltered={isFiltered} setIsFiltered={setIsFiltered}/>;
            case 3:
                return <ManageAdmins />;
            default:
                return null; // TODO: ......
        }
    } else{
        return < LogInPage setLoggedIn={setLoggedIn} />
    }
    
};