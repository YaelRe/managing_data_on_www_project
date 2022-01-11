import React from 'react';
import '../../App.css';

export interface SendNewPollProps {
    isFiltered: Boolean;
    selectedPollId: number;
    filteredAnswersList: string[];
}

export const SendNewPoll : React.FC<SendNewPollProps> = ({
    isFiltered,
    selectedPollId,
    filteredAnswersList,
}) => {

    const [currentQuestionInput, setCurrentQuestionInput] = React.useState<string>('');
    const [currentAnswer1Input, setCurrentAnswer1Input] = React.useState<string>('');
    const [currentAnswer2Input, setCurrentAnswer2Input] = React.useState<string>('');
    const [currentAnswer3Input, setCurrentAnswer3Input] = React.useState<string>('');
    const [currentAnswer4Input, setCurrentAnswer4Input] = React.useState<string>('');
    const [currentAnswersCounter, setCurrentAnswersCounter] = React.useState<number>(0);
    const [questionErrorMessage, setQuestionErrorMessage] = React.useState<string>('');
    const [answersErrorMessage, setAnswersErrorMessage] = React.useState<string>('');
    const [unselectedPollErrorMessage, setUnselectedPollErrorMessage] = React.useState<string>('');
    const [unselectedAnswersErrorMessage, setUnselectedAnswersErrorMessage] = React.useState<string>('');
    const [sentPollMessage, setSentPollMessage] = React.useState<string>('');
    const [sentPollErrorMessage, setSentPollErrorMessage] = React.useState<string>('');

    const isPollValid =  (question: string, answer1: string, answer2: string) => {
        let returnValue = true;
        if (question === ''){
            returnValue = false;
            setQuestionErrorMessage('poll question can not be empty');
        }
        if (currentAnswersCounter < 2){
            returnValue = false;
            setAnswersErrorMessage('poll must have at least 2 answers');
        }
        if (isFiltered){
            if (selectedPollId === -1){
                returnValue = false;
                setUnselectedPollErrorMessage("you didn't choose a poll to filter by")
            }
            if (filteredAnswersList.length === 0){
                returnValue = false;
                setUnselectedAnswersErrorMessage("you need to choose at least one answer to filter by")
            }
        }
        return returnValue;
    };

    const createPoll = async() => {
        setQuestionErrorMessage('');
        setAnswersErrorMessage('');
        setUnselectedPollErrorMessage('');
        setUnselectedAnswersErrorMessage('');
        setSentPollErrorMessage('');
        setSentPollMessage('');
        setCurrentAnswersCounter(0);
        const question = currentQuestionInput;
        const answer1 = currentAnswer1Input;
        const answer2 = currentAnswer2Input;
        const answer3 = currentAnswer3Input;
        const answer4 = currentAnswer4Input;
        const poll_id_to_filter_by = selectedPollId;
        const answers_to_filter_by = filteredAnswersList;
        const to_filter = isFiltered;


        if (!isPollValid(question, answer1, answer2)){
            return;
        }
        const requestData = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
       setCurrentAnswersCounter(0);

       if (serverResponse && serverResponse.status === 500){
            setSentPollErrorMessage(parsedServerResponse["message"]);//...........
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
        if(e.target.value !== ''){
            setCurrentAnswersCounter(currentAnswersCounter + 1);
        }
    };

    const handleAnswer2InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer2Input(e.target.value);
        if(e.target.value !== '') {
            setCurrentAnswersCounter(currentAnswersCounter + 1)
        }
    }

    const handleAnswer3InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer3Input(e.target.value);
        if(e.target.value !== '') {
            setCurrentAnswersCounter(currentAnswersCounter + 1);
        }
    }
    const handleAnswer4InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCurrentAnswer4Input(e.target.value);
        if(e.target.value !== '') {
            setCurrentAnswersCounter(currentAnswersCounter + 1);
        }
    }

    return (
        <div className='new-poll-container'>
            <h2 className='new-poll-header'> create new poll </h2>
            <p className='new-poll-answers-text'> question </p>
            <input className="poll-question" value={currentQuestionInput} onChange={handleQuestionInputChange} />
            <p className='new-poll-answers-text'> answers </p>
            <input className="poll-answer" value={currentAnswer1Input} onChange={handleAnswer1InputChange} />
            <input className="poll-answer" value={currentAnswer2Input} onChange={handleAnswer2InputChange} />
            <input className="poll-answer" value={currentAnswer3Input} onChange={handleAnswer3InputChange} />
            <input className="poll-answer" value={currentAnswer4Input} onChange={handleAnswer4InputChange} />
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