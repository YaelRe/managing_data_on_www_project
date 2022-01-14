import '../../../App.css';
import React from "react";
import Select, {SingleValue} from 'react-select'
import {ChartsComponent} from "./ChartsComponent";
import {Buffer} from "buffer";

export interface PollResultsProps {
    adminName: string;
    adminsPassword: string;
}

export const PollResults : React.FC<PollResultsProps> = ({
    adminName,
    adminsPassword,
}) => {

    const [pollsListOptions, setPollsListOptions] = React.useState<any[]>([]);
    const [pollAnswersList, setPollAnswersList] = React.useState<any[]>([]);
    const [selectedPollId, setSelectedPollId] = React.useState<number>(-1);
    const [isPollAnswered, setIsPollAnswered] = React.useState<boolean>(true);
    const [pieChartsData, setPieChartsData] = React.useState<any[]>([]);


    React.useEffect(() => {
        const fetchPollsData = async () => {
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-polls-list`
                ,{headers: new Headers({
                        'Authorization': 'Basic ' + Buffer.from(`${adminName}:${adminsPassword}`).toString('base64') })
                }
                );
                parsedServerResponse = await serverResponse.json();

            } catch (error) {
                console.log(error);
            }

            if (serverResponse && serverResponse.status === 200 && parsedServerResponse["polls_list"].length !== 0){
                const tempList = parsedServerResponse["polls_list"];
                const tempPollsListOptions: any[] = [];
                tempList.map((poll:any) =>{
                    const newJsonPoll: any ={
                        value: poll[0],
                        label: poll[1],
                    };
                    tempPollsListOptions.push((newJsonPoll));

                });
                setPollsListOptions(tempPollsListOptions);
            }
        };
        fetchPollsData();

    }, []);

    React.useEffect(() => {
        const fetchPollsAnswers = async () => {
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-poll-answers/${selectedPollId}`
                ,{headers: new Headers({
                            'Authorization': 'Basic ' + Buffer.from(`${adminName}:${adminsPassword}`).toString('base64') })
                    }
                );
                parsedServerResponse = await serverResponse.json();

            } catch (error) {
                console.log(error);
            }
            if (serverResponse && serverResponse.status === 200) {
                const tempList = parsedServerResponse["polls_answers_list"];
                const tempPollsAnswersListOptions: any[] = [];
                tempList.map((poll_answer: string) => {
                    const newJsonAnswer: any = {
                        value: poll_answer,
                        label: poll_answer,
                    };
                    tempPollsAnswersListOptions.push((newJsonAnswer));
                });
                setPollAnswersList(tempPollsAnswersListOptions);
            }
        };
        fetchPollsAnswers();

    }, [selectedPollId, setSelectedPollId]);

    React.useEffect(() => {
        const fetchPollsUsersAnswers = async () => {
            // debugger;
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-poll-user-answers/${selectedPollId}`
                    ,{headers: new Headers({
                            'Authorization': 'Basic ' + Buffer.from(`${adminName}:${adminsPassword}`).toString('base64') })
                    }
                );
                parsedServerResponse = await serverResponse.json();

            } catch (error) {
                console.log(error);
            }
            if (serverResponse && serverResponse.status === 200){
                const tempUsersResultsDict = parsedServerResponse["poll_users_answers"];

                const chartData: any[] = [];
                let isSomeoneAnswered = false;
                pollAnswersList.map((poll_answer_obj:any) =>{
                    const poll_answer = poll_answer_obj["label"];
                    const newJsonAnswerVotes: any ={
                        answer: [poll_answer],
                        votes: tempUsersResultsDict[poll_answer],
                    };
                     chartData.push((newJsonAnswerVotes));
                     if (tempUsersResultsDict[poll_answer] !== 0){
                        isSomeoneAnswered = true;
                    }
                });
                if (selectedPollId !== -1){
                    setPieChartsData(chartData);
                    setIsPollAnswered(isSomeoneAnswered);
                }
            }
        }; fetchPollsUsersAnswers();

    }, [setPollAnswersList, pollAnswersList]);

     const handlePollSelected = (event: SingleValue<{ value: number, label: string }>) => {
         setIsPollAnswered(true);
         if (event !== null ){
             setSelectedPollId(event.value);
         }
    };

        return (
        <>
            <h2 style={{marginBottom: '40px'}}> Choose poll to see it's results:</h2>
            <div className='polls-list-container'>
                <Select className='select-container' options={pollsListOptions} onChange={handlePollSelected} placeholder={"Select poll..."}/>
            </div>
            <div className='charts-component'>
                {   isPollAnswered  ?
                    <ChartsComponent pieChartsData={pieChartsData}/> :
                    <h2> There are still no users answers for this poll </h2>
            }

            </div>
        </>
    );
};
