import '../../../App.css';
import React from "react";
import Select, {SingleValue} from 'react-select'
import {Buffer} from "buffer";
import {PieChartComponent} from "./PieChartComponent"
import {XYChartComponent} from "./XYChartComponent";

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
    const [isPollAnswered, setIsPollAnswered] = React.useState<boolean>(false);
    const [isPollSelected, setIsPollSelected] = React.useState<boolean>(false);
    const [pieChartsData, setPieChartsData] = React.useState<any[]>([]);
    const [xyChartsData, setXyChartsData] = React.useState<any[]>([]);


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
    const fetchPollsAnswersAmountData = async () => {
        let serverResponse;
        let parsedServerResponse;
        try {
            serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-polls-answers-amount`
            ,{headers: new Headers({
                    'Authorization': 'Basic ' + Buffer.from(`${adminName}:${adminsPassword}`).toString('base64') })
            }
            );
            parsedServerResponse = await serverResponse.json();

        } catch (error) {
            console.log(error);
        }

        if (serverResponse && serverResponse.status === 200 && parsedServerResponse["polls_answers_amount_list"].length !== 0){
            const tenpPollsAnswersAmountList = parsedServerResponse["polls_answers_amount_list"];
            const tempXyChartData: any[] = [];
            tenpPollsAnswersAmountList.map((poll:any) =>{
                const newJsonPollAnswersAmount: any ={
                    poll: poll[0],
                    users_answers_amount: poll[1],
                };
                tempXyChartData.push((newJsonPollAnswersAmount));

            });
            setXyChartsData(tempXyChartData);
        }
    };
    fetchPollsAnswersAmountData();

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
                    setIsPollSelected(true);
                }
            }
        }; fetchPollsUsersAnswers();

    }, [setPollAnswersList, pollAnswersList]);

     const handlePollSelected = (event: SingleValue<{ value: number, label: string }>) => {
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

                { isPollAnswered && (<h3 style={{marginBottom: '-50px'}}> Answer distribution for chosen poll: </h3>)}
                { isPollAnswered && (<PieChartComponent pieChartsData={pieChartsData}/>)}
                { isPollSelected && !isPollAnswered &&(<h3 style={{marginBottom: '60px'}}> There are still no users answers for the chosen poll </h3>)}
                { pollsListOptions.length > 0  && (<h3 style={{marginBottom: '-50px'}}> Answers amount for each poll: </h3>)}
                 <XYChartComponent xyChartsData={xyChartsData}/>
            </div>
        </>
    );
};
