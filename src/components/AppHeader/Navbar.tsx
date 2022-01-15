import { pages } from '../../app-constants';
import '../../App.css';

export interface NavbarProps {
    changePage(newPage: number): void;
}
export const Navbar: React.FC<NavbarProps> = ({
    changePage,
}) => {
    const handlePageChange = (page: string) => {
        switch(page) {
            case 'Polls Results':
                changePage(0);
                break;
            case 'Send new poll':
                changePage(1);
                break;
            case 'Send new filtered poll':
                changePage(2);
                break;
            case 'Admins Managment':
                changePage(3);
                break;
            default:
                break;
        }    
    }

    return (
        <div className='nav-tab'>
            {pages.map(page => 
                <button key={page} className='nav-button' onClick={() => handlePageChange(page)}>
                    {page}
                </button>)}
        </div>
    )
}