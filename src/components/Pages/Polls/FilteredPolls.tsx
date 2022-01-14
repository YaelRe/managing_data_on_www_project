import '../../../App.css';
import React from "react";
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
            <h2 style={{marginBottom: '45px'}}> Choose poll and answers to filter by:</h2>
            <div className='polls-list-container' style={{left: '50%'}}>
                <Select className='select-container' options={pollsListOptions} onChange={handlePollSelected} placeholder={"Select poll..."}/>
                {isPollSelected && (<Select className='select-container' options={pollAnswersList} isMulti onChange={handleAnswerSelected} isClearable={false} placeholder={"Select answers..."} />)}
            </div>
        </>
    );
};