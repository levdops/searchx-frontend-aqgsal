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
        log(LoggerEventTypes.SURVEY_QUALITY_REGISTER, {
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
        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            if (res) {

                console.error("registered user: ", res.taskData);
                this.props.history.push('/ssal/qqualitytest');
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
        <h3> Findout who is the real author!</h3>
        
        <hr/>
        <p> We have some passages and questions created by remote workers. Some of them may cheat by using automated writing tools to create these questions. Therefore we need to evaluate the questions' quality. We want you to rate the questions' quality with respect to its relevance (from 1 to 5, representing the relevance from unrelevant to perfectly relevant), answerability (from 1 to 5, representing the question from totally unanswerable to perfectly answerable with information from the passage), and the possibility that the question is written by humans or automated writing tools (from 1 to 5, representing the question is absolutely written by automated writing tool to absolutely by a human).  </p>
        <p style="color:red"> <b> Do not change tabs and do not reload. These activities would loose your progress or make you disqualified </b> </p>
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
        type: "html",
        html: "<hr/>"
    });

    pages.push({elements:  elements});

    
    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;
