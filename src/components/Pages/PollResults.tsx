import '../../App.css';
import React from "react";
import Select, {SingleValue} from 'react-select'
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am4themes_animated from "@amcharts/amcharts5/themes/animated";
import {ChartsComponent} from "../ChartsComponent";

// am5.useTheme(am4themes_animated);

export const PollResults = () => {

    const [pollsListOptions, setPollsListOptions] = React.useState<any[]>([]);
    const [pollAnswersList, setPollAnswersList] = React.useState<any[]>([]);
    const [isPollSelected, setIsPollSelected] = React.useState<Boolean>(false);
    const [selectedPollId, setSelectedPollId] = React.useState<number>(-1);
    const [pieChartsData, setPieChartsData] = React.useState<any[]>([]);
    // const chartsRoot = React.useRef<any>(null);

    React.useEffect(() => {
        const fetchPollsData = async () => {
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-polls-list`);
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
            // TODO: handle 500 status (empty list, internal error)
            // if (chartsRoot !== null) {
            //     chartsRoot.current = am5.Root.new("chartDiv");
            // }
        };
        fetchPollsData();

    }, []);

    React.useEffect(() => {
        const fetchPollsAnswers = async () => {
            // const fetchPollsAnswers = async (poll_id: number) => {
            // debugger;
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-poll-answers/${selectedPollId}`);
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
                setIsPollSelected(true);
            }
            // debugger;
            // TODO: handle 500 status (empty list, internal error)
            // };
        };
        fetchPollsAnswers();

    }, [selectedPollId, setSelectedPollId]);

    React.useEffect(() => {
        const fetchPollsUsersAnswers = async () => {
            // debugger;
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-poll-user-answers/${selectedPollId}`);
                parsedServerResponse = await serverResponse.json();

            } catch (error) {
                console.log(error);
            }
            if (serverResponse && serverResponse.status === 200){
                const tempUsersResultsDict = parsedServerResponse["poll_users_answers"];

                const chartData: any[] = [];
                pollAnswersList.map((poll_answer_obj:any) =>{
                    const poll_answer = poll_answer_obj["label"];
                    const newJsonAnswerVotes: any ={
                        answer: [poll_answer],
                        votes: tempUsersResultsDict[poll_answer],
                    };
                     chartData.push((newJsonAnswerVotes));
                });
                setPieChartsData(chartData);
                // debugger;
                // setIsPollSelected(true);
            }
            // TODO: handle 500 status (empty list, internal error)
        }; fetchPollsUsersAnswers();

    }, [setIsPollSelected,setPollAnswersList, pollAnswersList]);

     const handlePollSelected = (event: SingleValue<{ value: number, label: string }>) => {
         setIsPollSelected(false);
         if (event !== null){
             setSelectedPollId(event.value);
             //fetchPollsAnswers();
             // fetchPollsUsersAnswers(event.value);
         }
    };

        return (
        <>
            <h2> Choose poll to see it's results:</h2>
            <div className='polls-list-container'>
                <Select options={pollsListOptions} onChange={handlePollSelected} placeholder={"Select poll..."}/>
            </div>
            <div className='charts-component'>
                <ChartsComponent pieChartsData={pieChartsData}/>
            </div>
        </>
    );
};
