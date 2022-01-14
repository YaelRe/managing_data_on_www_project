import React from 'react';
import '../../App.css';

export interface LogInPageProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
    setAdminName : React.Dispatch<React.SetStateAction<string>>;
    setAdminsPassword : React.Dispatch<React.SetStateAction<string>>;
}

export const LogInPage: React.FC<LogInPageProps> = ({
    setLoggedIn,
    setAdminName,
    setAdminsPassword,
}) => {

    const [currentAdminNameInput, setCurrentAdminNameInput] = React.useState<string>('');
    const [currentPasswordInput, setCurrentPasswordInput] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const checkAuthentication = async() => {
        setErrorMessage('');
        const adminName = currentAdminNameInput;
        const password = currentPasswordInput;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName, password })
        };

        let serverResponse;
        let parsedServerResponse;
        try {
            serverResponse = await fetch(`http://127.0.0.1:5000/admins/check-admin-authorization/`, requestOptions);
            parsedServerResponse = await serverResponse.json();
        } catch(e) {
            console.error(e);
       }
  

       if (serverResponse && serverResponse.status === 400){
            setErrorMessage(parsedServerResponse["message"]);
            setCurrentPasswordInput('');
       } else if (parsedServerResponse["is_correct_password"] === false){
            setErrorMessage('password is incorrect!');
            setCurrentPasswordInput('');
       } else{
           setAdminName(currentAdminNameInput)
           setAdminsPassword(currentPasswordInput)
           setCurrentPasswordInput('');
           setLoggedIn(true)
       }
    };

    const handleAdminNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // What is the problem with this approach? Read about debouncing.
        e.preventDefault();
        setCurrentAdminNameInput(e.target.value); // Hint <- this is the problem. think about state and re-rendering.
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentPasswordInput(e.target.value); // Hint <- this is the problem. think about state and re-rendering.
    };

    return (
        <>
            <div className='login-form-container'>
                <p className="login-text">Admin Name</p>
                <input className="text" value={currentAdminNameInput} onChange={handleAdminNameInputChange} />
                <p className="login-text">Password</p>
                <input className="password" type="password" value={currentPasswordInput} onChange={handlePasswordInputChange} />
                <div className='submit-button' style={{marginTop: '40px'}}>
                    <button className="submit" onClick={checkAuthentication}>Submit</button>
                </div>
                {errorMessage && (<p className="error-message"> {errorMessage} </p>)}
            </div>
        </>
    );
};