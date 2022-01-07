import { pages } from '../../app-constants';
import '../../App.css';

export interface NavbarProps {
    changePage(newPage: number): void;
}
export const Navbar: React.FC<NavbarProps> = ({
    changePage,
}) => {
    const handlePageChange = (page: string) => {
        // Think about a better way to do that:
        switch(page) {
            case 'Polls Results':
                changePage(0);
                break;
            case 'Polls Managment':
                changePage(1);
                break;
            case 'Admins Managment':
                changePage(2);
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