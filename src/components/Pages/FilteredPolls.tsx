import '../../App.css';
import React from "react";
import { Poll } from '../../types';
import Select, {MultiValue, SingleValue} from 'react-select'
import {Buffer} from "buffer";

export interface FilteredPollsProps {
    setSelectedPollId: React.Dispatch<React.SetStateAction<number>>;
    setFilteredAnswersList: React.Dispatch<React.SetStateAction<string[]>>;
    adminName: string;
    adminsPassword: string;

}

export const FilteredPolls : React.FC<FilteredPollsProps> = ({
    setSelectedPollId,
    setFilteredAnswersList,
    adminName,
    adminsPassword,
}) => {

    const [pollsList, setPollsList] = React.useState<Poll[]>([]);
    const [pollsListOptions, setPollsListOptions] = React.useState<any[]>([]);
    const [pollAnswersList, setPollAnswersList] = React.useState<any[]>([]);
    const [isPollSelected, setIsPollSelected] = React.useState<Boolean>(false);

    React.useEffect(() => {

        const fetchPollsData = async () => {
            setSelectedPollId(-1);
            setFilteredAnswersList([]);
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-polls-list`,
                    {headers: new Headers({
                            'Authorization': 'Basic ' + Buffer.from(`${adminName}:${adminsPassword}`).toString('base64') })
                    }
                );
                parsedServerResponse = await serverResponse.json();

            } catch (error) {
                console.log(error);
            }

            if (serverResponse && serverResponse.status === 200 && parsedServerResponse["polls_list"].length !== 0){
                const tempList = parsedServerResponse["polls_list"];
                const tempPollsList: Poll[] = [];
                const tempPollsListOptions: any[] = [];
                tempList.map((poll:any) =>{
                    const newPoll: Poll = {
                    poll_id: poll[0],
                    poll_question:  poll[1],
                    };
                    tempPollsList.push(newPoll);
                    const newJsonPoll: any ={
                        value: poll[0],
                        label: poll[1],
                    };
                    tempPollsListOptions.push((newJsonPoll));

                });
                setPollsListOptions(tempPollsListOptions);
                setPollsList(tempPollsList);
            }
            // TODO: handle 500/401? status (empty list, internal error)
        };

        fetchPollsData();

    }, []);

    const fetchPollsAnswers = async (poll_id: number) => {
            let serverResponse;
            let parsedServerResponse;
            try {
                serverResponse = await fetch(`http://127.0.0.1:5000/admins/get-poll-answers/${poll_id}`
                ,{headers: new Headers({
                            'Authorization': 'Basic ' + Buffer.from(`${adminName}:${adminsPassword}`).toString('base64') })
                    }
                );
                parsedServerResponse = await serverResponse.json();

            } catch (error) {
                console.log(error);
            }
            if (serverResponse && serverResponse.status === 200){
                const tempList = parsedServerResponse["polls_answers_list"];
               const tempPollsAnswersListOptions: any[] = [];
                tempList.map((poll_answer:string) =>{
                    const newJsonAnswer: any ={
                        value: poll_answer,
                        label: poll_answer,
                    };
                    tempPollsAnswersListOptions.push((newJsonAnswer));
                });
                setPollAnswersList(tempPollsAnswersListOptions);
                setIsPollSelected(true);
            }
            // TODO: handle 500/401? status (empty list, internal error)
        };


     const handlePollSelected = (event: SingleValue<{ value: number, label: string }>) => {
         setIsPollSelected(false);
         if (event !== null){
             setSelectedPollId(event.value);
             fetchPollsAnswers(event.value);
         }
    };

     const handleAnswerSelected = (event: MultiValue<{ value: string, label: string }>) => {
         if (event !== null){
             let newFilteredAnswersList : string[] = [];
             event.map((poll_answer:any) =>{
                    newFilteredAnswersList.push(poll_answer.value);
             });
             setFilteredAnswersList(newFilteredAnswersList);
         }
    };


    return (
        <>
            <h2> Choose poll and answers to filter by:</h2>
            <div className='polls-list-container'>
                <Select options={pollsListOptions} onChange={handlePollSelected} placeholder={"Select poll..."}/>
                {isPollSelected && (<Select options={pollAnswersList} isMulti onChange={handleAnswerSelected} isClearable={false} placeholder={"Select answers..."} />)}
            </div>
        </>
    );
};