import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";
import SyncStore from "../../../stores/SyncStore";


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
        this.onLeave = this.onLeave.bind(this);
    }

    render() {
        const task = AccountStore.getTaskData();
        console.error("---task description before register");
        console.log(task)

        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        />
    }

    ////
    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "register",
            state : this.state
        });
        
        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onComplete(data) {
        console.error(data)
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });

        const userId = data['userId'].trim();
        console.error(userId);
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);
        
        const taskParams = {
            groupSize: constants.groupSize,
            topicsSize: constants.topicsSize,
            userId: userId,
        };
        SessionStore.getRegisteredUser(constants.taskId, taskParams, (res) => {
            if (res) {                
                console.error("registered user: ", res.taskData);
                if ('topic' in res.taskData) {
                    // console.log("register", res);
                    this.props.history.push('/ssal/longtermposttest');
                }
            }
        });
    }
}

const formData = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>STUDY DESCRIPTION</h2>"
    });

    elements.push({
        type: "html",
        name: "start",
        html: `
        <h3> Let's find out how much knowledge you still remember!</h3>
        
        <hr/>
        <p> One week ago, you took the task <b>Search as Learning: spend about half an hour learning about a topic by searching the web with our search engine!</b>. This task would ask you to take one test. This test consists same questions as you were asked in the post-test of the search to learn task one week ago. Please answer the questions truthfully. Try to recall your knowledge of the topic you learned in the study of search to learn as much as you can. Your payment is not affected by the number of correct or incorrect answers. </p>
        `
    });

    elements.push({
        title: "Insert your assigned Prolific ID here",
        name : "userId",
        type :"text",
        inputType:"text",
        width: 300,
        isRequired: true
    });


    elements.push({
        title: "Do you still remember the topic name you learned in the previous study?",
        name: "topicRemembered",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });

    elements.push({
        title: "What is the name of the topic?",
        visibleIf: "{topicRemembered} == 1",
        name: "memoryTopicName",
        type: "text",
        inputType: "text",
        width: 500,
        isRequired: true,
    });



    elements.push({
        type: "html",
        html: "<hr/>"
    });

    pages.push({elements:  elements});


    var topics = constants.candidate_topics.sort(()=> 0.5 - Math.random()).slice(0, constants['topicsSize']); 
    
    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;
