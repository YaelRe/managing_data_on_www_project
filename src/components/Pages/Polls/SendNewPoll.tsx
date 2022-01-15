import React from 'react';
import '../../../App.css';
import {Buffer} from "buffer";

export interface SendNewPollProps {
    isFiltered: Boolean;
    selectedPollId: number;
    filteredAnswersList: string[];
    adminName: string;
    adminsPassword: string;
}

export const SendNewPoll : React.FC<SendNewPollProps> = ({
    isFiltered,
    selectedPollId,
    filteredAnswersList,
    adminName,
    adminsPassword,
}) => {

    const [currentQuestionInput, setCurrentQuestionInput] = React.useState<string>('');
    const [currentAnswer1Input, setCurrentAnswer1Input] = React.useState<string>('');
    const [currentAnswer2Input, setCurrentAnswer2Input] = React.useState<string>('');
    const [currentAnswer3Input, setCurrentAnswer3Input] = React.useState<string>('');
    const [currentAnswer4Input, setCurrentAnswer4Input] = React.useState<string>('');
    const [questionErrorMessage, setQuestionErrorMessage] = React.useState<string>('');
    const [answersErrorMessage, setAnswersErrorMessage] = React.useState<string>('');
    const [answersDuplicationErrorMessage, setAnswersDuplicationErrorMessage] = React.useState<string>('');
    const [unselectedPollErrorMessage, setUnselectedPollErrorMessage] = React.useState<string>('');
    const [unselectedAnswersErrorMessage, setUnselectedAnswersErrorMessage] = React.useState<string>('');
    const [sentPollMessage, setSentPollMessage] = React.useState<string>('');
    const [sentPollErrorMessage, setSentPollErrorMessage] = React.useState<string>('');

    const isPollValid =  (question: string) => {
        let returnValue = true;
        if (question === ''){
            returnValue = false;
            setQuestionErrorMessage('Poll question can not be empty');
        }
        let answersCounter = 0;
        if (currentAnswer1Input !== '') {
            answersCounter = answersCounter +1
        }
        if (currentAnswer2Input !== '') {
            answersCounter = answersCounter +1;
            if (currentAnswer2Input === currentAnswer1Input){
                setAnswersDuplicationErrorMessage('Answers should be unique and not duplicated');
                returnValue = false;
            }
        }
        if (currentAnswer3Input !== '') {
            answersCounter = answersCounter +1;
            if (currentAnswer3Input === currentAnswer2Input || currentAnswer3Input === currentAnswer1Input){
                setAnswersDuplicationErrorMessage('Answers should be unique and not duplicated');
                returnValue = false;
            }
        }
        if (currentAnswer4Input !== '') {
            answersCounter = answersCounter +1;
            if (currentAnswer4Input === currentAnswer3Input || currentAnswer4Input === currentAnswer2Input || currentAnswer4Input === currentAnswer1Input){
                setAnswersDuplicationErrorMessage('Answers should be unique and can\'t be duplicated');
                returnValue = false;
            }
        }

        if (answersCounter < 2){
            returnValue = false;
            setAnswersErrorMessage('Poll must have at least 2 answers');
        }
        if (isFiltered){
            if (selectedPollId === -1){
                returnValue = false;
                setUnselectedPollErrorMessage("You didn't choose a poll to filter by")
            }
            if (filteredAnswersList.length === 0){
                returnValue = false;
                setUnselectedAnswersErrorMessage("You need to choose at least one answer to filter by")
            }
        }
        return returnValue;
    };

    const createPoll = async() => {
        setQuestionErrorMessage('');
        setAnswersErrorMessage('');
        setAnswersDuplicationErrorMessage('');
        setUnselectedPollErrorMessage('');
        setUnselectedAnswersErrorMessage('');
        setSentPollErrorMessage('');
        setSentPollMessage('');
        const question = currentQuestionInput;
        const answer1 = currentAnswer1Input;
        const answer2 = currentAnswer2Input;
        const answer3 = currentAnswer3Input;
        const answer4 = currentAnswer4Input;
        const poll_id_to_filter_by = selectedPollId;
        const answers_to_filter_by = filteredAnswersList;
        const to_filter = isFiltered;


        if (!isPollValid(question)){
            return;
        }
        const requestData = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , 'Authorization': 'Basic ' +
                    Buffer.from(`${adminName}:${adminsPassword}`).toString('base64')},
            body: JSON.stringify({ question, answer1, answer2, answer3, answer4,
                poll_id_to_filter_by, answers_to_filter_by ,to_filter})
        };

        let serverResponse;
        let parsedServerResponse;
        try {
            serverResponse = await fetch(`http://127.0.0.1:5000/admins/send-poll/`, requestData);
            parsedServerResponse = await serverResponse.json();
        } catch(e) {
            console.error(e);
       }
       setCurrentQuestionInput('');
       setCurrentAnswer1Input('');
       setCurrentAnswer2Input('');
       setCurrentAnswer3Input('');
       setCurrentAnswer4Input('');

       if (serverResponse && serverResponse.status !== 200){
            setSentPollErrorMessage(parsedServerResponse["message"]);

       } else {
           setSentPollMessage("Poll was sent successfully")
       }
    };

    const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentQuestionInput(e.target.value);
    };

    const handleAnswer1InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer1Input(e.target.value);
    };

    const handleAnswer2InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer2Input(e.target.value);
    };

    const handleAnswer3InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer3Input(e.target.value);
    };
    const handleAnswer4InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer4Input(e.target.value);
    };

    return (
        <div className='new-poll-container'>
            <h2 className='new-poll-header'> create new poll: </h2>
            <p className='new-poll-answers-text'> question </p>
            <input className="poll-question" value={currentQuestionInput} onChange={handleQuestionInputChange} />
            <p className='new-poll-answers-text'> answers </p>
            <div className="answers-container">
                <input className="poll-answer" value={currentAnswer1Input} onChange={handleAnswer1InputChange} />
                <input className="poll-answer" value={currentAnswer2Input} onChange={handleAnswer2InputChange} />
                <input className="poll-answer" value={currentAnswer3Input} onChange={handleAnswer3InputChange} />
                <input className="poll-answer" value={currentAnswer4Input} onChange={handleAnswer4InputChange} />
            </div>
            <div className='submit-button'>
                <button className="submit-poll-button" onClick={createPoll}>Create Poll</button>
            </div>
            <div>
            {questionErrorMessage && (<p className="error-message"> {questionErrorMessage} </p>)}
            </div>
            <div>
            {answersErrorMessage && (<p className="error-message"> {answersErrorMessage} </p>)}
            </div>
            <div>
            {answersDuplicationErrorMessage && (<p className="error-message"> {answersDuplicationErrorMessage} </p>)}
            </div>
            <div>
            {unselectedPollErrorMessage && (<p className="error-message"> {unselectedPollErrorMessage} </p>)}
            </div>
            <div>
            {unselectedAnswersErrorMessage && (<p className="error-message"> {unselectedAnswersErrorMessage} </p>)}
            </div>
            <div>
            {sentPollMessage && (<p className="success-message"> {sentPollMessage} </p>)}
            {sentPollErrorMessage && (<p className="error-message"> {sentPollErrorMessage} </p>)}
            </div>
        </div>)
};