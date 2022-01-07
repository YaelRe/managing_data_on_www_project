import React from 'react';
import '../../App.css';

export interface LogInPageProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

export const LogInPage: React.FC<LogInPageProps> = ({
    setLoggedIn,
}) => {

    const [currentAdminNameInput, setCurrentAdminNameInput] = React.useState<string>('');
    const [currentPasswordInput, setCurrentPasswordInput] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const checkAuthentication = async() => {
        const adminName = currentAdminNameInput
        const password = currentPasswordInput

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName, password })
        };

        let serverResponse;
        let parsedServerResponse;
        try {
            serverResponse = await fetch(`http://127.0.0.1:5000/admins/authorize-admin/`, requestOptions);
            parsedServerResponse = await serverResponse.json();
        } catch(e) {
            console.error(e);
       }
  
       setCurrentPasswordInput('')
       if (serverResponse && serverResponse.status === 400){
            setErrorMessage(parsedServerResponse["message"]);
       } else if (parsedServerResponse["is_correct_password"] === false){
            setErrorMessage('password is incorrect!');
       } else{
            setLoggedIn(true)
       }
    }

    const handleAdminNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // What is the problem with this approach? Read about debouncing.
        e.preventDefault();
        setCurrentAdminNameInput(e.target.value); // Hint <- this is the problem. think about state and re-rendering.
    }

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // What is the problem with this approach? Read about debouncing.
        e.preventDefault();
        setCurrentPasswordInput(e.target.value); // Hint <- this is the problem. think about state and re-rendering.
    }

    return (
        <> 
            <h2> Hi admin, please log in</h2>
            <div className='login-form-container'>
                <p className="login-text">Admin Name</p>
                <input className="text" value={currentAdminNameInput} onChange={handleAdminNameInputChange} />
                <p className="login-text">Password</p>
                <input className="password" type="password" value={currentPasswordInput} onChange={handlePasswordInputChange} />
                <div className='submit-button'>
                    <button className="submit" onClick={checkAuthentication}>Submit</button>
                </div>
                {errorMessage && (<p className="error"> {errorMessage} </p>)}
            </div>
        </>
    );
}