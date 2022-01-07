import '../../App.css';
import { Navbar } from './Navbar';

export interface HeaderProps {
    changePage(newPage: number): void;
    loggedIn: Boolean;
}
export const Header: React.FC<HeaderProps> = ({
    changePage,
    loggedIn
}) => {

    return (
        <div className='header-container'>
            <h1 className='app-header'> Poll Manager </h1>
            {loggedIn && (<Navbar changePage={changePage}/>)}
            
           
        </div>
    )
}

// <Navbar changePage={changePage}/>
