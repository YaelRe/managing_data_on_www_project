import '../../App.css';
import React from "react";
import {Character} from "../../types";
import {AdminLine} from "../AdminLine";



export const AddAdmin = () => {

    const [currentAdminNameInput, setCurrentAdminNameInput] = React.useState<string>('');
    const [currentPasswordInput, setCurrentPasswordInput] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const [admins, setAdmins] = React.useState<string[]>([]);
    // const [ fetchingData, setFetchingData ] = React.useState(true);

    React.useEffect(() => {

        const fetchAdminsData = async () => {
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-admins-list`);
                parsedServerResponse = await serverResponse.json();
                // setFetchingData(false)

            } catch (error) {
                console.log(error);
            }

            if (serverResponse && serverResponse.status === 200 && parsedServerResponse["admins_list"].length !== 0){
                const temp_list = parsedServerResponse["admins_list"];
                setAdmins(temp_list);
            }
        };

        // We acticed the async function
        fetchAdminsData();

    }, []);

    const addAdminHandler = async() => {
        setErrorMessage('');
        setSuccessMessage('');
        const adminName = currentAdminNameInput;
        const password = currentPasswordInput;

        if (password === ''){
            setErrorMessage("password can not be empty");
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName, password })
        };

        let serverResponse;
        let parsedServerResponse;
        try {
            serverResponse = await fetch(`http://127.0.0.1:5000/admins/add-admin/`, requestOptions);
            parsedServerResponse = await serverResponse.json();
        } catch(e) {
            console.error(e);
       }

       if (serverResponse && serverResponse.status === 200){
            const newAdminsList = [...admins, adminName];
            setAdmins(newAdminsList);
            setSuccessMessage(parsedServerResponse["message"]);
       } else {
            setErrorMessage(parsedServerResponse["message"]);
       }
       setCurrentAdminNameInput('');
       setCurrentPasswordInput('');
    };

    const handleAdminNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // What is the problem with this approach? Read about debouncing.
        e.preventDefault();
        setCurrentAdminNameInput(e.target.value); // Hint <- this is the problem. think about state and re-rendering.
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // What is the problem with this approach? Read about debouncing.
        e.preventDefault();
        setCurrentPasswordInput(e.target.value); // Hint <- this is the problem. think about state and re-rendering.
    };

    return (
        <>
            <h2> Add new admin</h2>
            <div className='add-admin-form-container'>
                <p className="login-text">Admin Name</p>
                <input className="text" value={currentAdminNameInput} onChange={handleAdminNameInputChange} />
                <p className="login-text">Password</p>
                <input className="password" value={currentPasswordInput} onChange={handlePasswordInputChange} />
                <div className='submit-button'>
                    <button className="submit" onClick={addAdminHandler}>Submit</button>
                </div>
                {errorMessage && (<p className="error-message"> {errorMessage} </p>)}
                {successMessage && (<p className="success-message"> {successMessage} </p>)}
            </div>
            <div className='admins-container'>
                <h2>Admins list </h2>
            {/*    change ket to better key*/}
            {   admins.length > 0 ?
                    admins.map(admin =>
                    <AdminLine key={Math.random()} admin={admin}/>) :

                    <h2> No admins in DB </h2>
            }
            </div>
        </>
    );
};