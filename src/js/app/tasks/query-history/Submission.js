import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

class Submission extends React.Component {
    render() {
        return (
        <div className='message'>
       <h2>Thank you for taking part in our study.</h2> 
       <h3>Follow this <a href={constants.completionURL}> link</a> back to Prolific Academic to confirm your participation.</h3>
        </div>
        )
    }
};

export default Submission;
