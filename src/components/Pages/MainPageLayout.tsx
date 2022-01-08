import React from 'react';
import '../../App.css';
import { About } from './AboutPage/About';
import { FAQ } from './FAQPage/FAQ';
import { LogInPage } from './LogInPage';
import { CreateNewPoll } from './CreateNewPoll';
import { AddAdmin } from './AddAdmin';

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

    if(loggedIn){
        switch(page) {
            case 0:
                return <About />;
            case 1:
                return <CreateNewPoll />;
            case 2:
                return <AddAdmin />;
            default:
                return null; // TODO: ......
        }
    } else{
        return < LogInPage setLoggedIn={setLoggedIn} />
    }
    
};