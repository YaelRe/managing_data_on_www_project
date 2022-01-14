import React from 'react';
import '../../App.css';
import { LogInPage } from './LogInPage';
import { ManageAdmins } from './Admins/ManageAdmins';
import {CreateFilteredPoll} from "./Polls/CreateFilteredPoll";
import {CreateRegularPoll} from "./Polls/CreateRegularPoll";
import {PollResults} from "./Results/PollResults";

export interface MainPageLayoutProps {
    loggedIn: Boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
    adminName :string;
    setAdminName : React.Dispatch<React.SetStateAction<string>>;
    adminsPassword :string;
    setAdminsPassword : React.Dispatch<React.SetStateAction<string>>;
    page: number
}
export const MainPageLayout: React.FC<MainPageLayoutProps> = ({
    loggedIn,
    setLoggedIn,
    adminName,
    setAdminName,
    adminsPassword,
    setAdminsPassword,
    page,
}) => {

    const [selectedPollId, setSelectedPollId] = React.useState<number>(-1);
    const [filteredAnswersList, setFilteredAnswersList] = React.useState<string[]>([]);
    const [isFiltered, setIsFiltered] = React.useState<Boolean>(false);

    if(loggedIn){
        switch(page) {
            case 0:
                return < PollResults adminName={adminName} adminsPassword={adminsPassword}/>;
            case 1:
                return <CreateRegularPoll isFiltered={isFiltered} setIsFiltered={setIsFiltered}
                                        adminName={adminName} adminsPassword={adminsPassword} />;
            case 2:
                return <CreateFilteredPoll selectedPollId={selectedPollId} setSelectedPollId={setSelectedPollId}
                                           filteredAnswersList={filteredAnswersList} setFilteredAnswersList={setFilteredAnswersList}
                                           isFiltered={isFiltered} setIsFiltered={setIsFiltered}
                                            adminName={adminName} adminsPassword={adminsPassword}/>;
            case 3:
                return <ManageAdmins adminName={adminName} adminsPassword={adminsPassword}/>;
            default:
                return <h1> 400 - Bad request </h1>;
        }
    } else{
        return < LogInPage setLoggedIn={setLoggedIn} setAdminName={setAdminName} setAdminsPassword={setAdminsPassword}/>
    }
    
};