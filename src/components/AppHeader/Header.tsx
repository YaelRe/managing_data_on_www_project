import React from 'react';
import '../../App.css';
import { Navbar } from './Navbar';

export interface HeaderProps {
    changePage(newPage: number): void;
    setLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
    loggedIn: Boolean;
}
export const Header: React.FC<HeaderProps> = ({
    changePage,
    setLoggedIn,
    loggedIn,
}) => {

    const HandleLogOutClick = () => {
        setLoggedIn(false);
        changePage(0);
    };

    return (
        <div className='header-container'>
            <h1 className='app-header'> Poll Manager  </h1>
            {loggedIn && (<Navbar changePage={changePage}/>)}
            <div className='log-out-button'>
                {loggedIn && (<button className="log-out" onClick={HandleLogOutClick}>Log Out</button>)}
            </div>
        </div>
    )
};


