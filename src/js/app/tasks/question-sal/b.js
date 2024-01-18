import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";
import samples from "./sampled_questions"

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Helpers from "../../../utils/Helpers";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SessionStore from "../../../stores/SessionStore";
import IntroStore from "../../../stores/IntroStore";
import FormContainer from "../components/form/FormContainer";
import Alert from "react-s-alert";


class QuestionQualityTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true',
        };

        this.onComplete = this.onComplete.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onTimeout = this.onTimeout.bind(this);
    }

    render() {
        window.globalPage = 1;
        localStorage.setItem("post-test", 1);
        return (
            <div className="Form">
            <Form
                    formData={formData()}
                    onComplete={this.onComplete}
                    onSwitchPage={this.onSwitchPage}
                    onLeave={this.onLeave}
                    disableCopy={true}
            />
            </div>
            )

    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_QUALITY_TEST_RESULTS, {
            data: data
        });

        console.log("question quality", localStorage.getItem("session-num"), data)
        
        
        localStorage.setItem('posttest-finish', true.toString());
        this.state.finished = true;
    }


    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "longtermposttest",            
            state : this.state
        });
        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onTimeout() {
        log(LoggerEventTypes.SURVEY_GROUPING_TIMEOUT, {
            step : "longtermposttest",
            state: this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-longtermposttest") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-longtermposttest", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "longtermposttest",
            switch: switchTabs
        });

        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-longtermposttest");

            Alert.error('You have been disqualified from the study.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        } else {
            Alert.error('We have noticed that you have tried to change to a different window/tab. Please, focus on completing the test.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });

            Alert.warning(`Remember that more than ${constants.switchPageLimit} tab changes result in a disqualification. So far you have changed tabs ${switchTabs} time(s)`, {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    }
}

const formData = function () {
    let pages = [];
    let elements = [];

    ////

    Helpers.shuffle(samples).forEach((term, idx) => {
        elements = [];
        elements.push({
            type: "html",
            name: "topic",
            html: `<br></br>`+
            `<div class="card-header"> <h3> Read the passage and rate the question quality. </h3> </div>` + 
            `<br></br>` +
                `<hr><p>  ${term.text} </p>` +
                `<hr> <h5 class="card-title"> ${term.question} </h5> <hr>`                
        });

        const name = term.id;
            
        elements.push({
            title: "How is the question relevant to the passage?",
            name: term.id+"_relevance",
            type: "rating",
            isRequired: true,
            minRateDescription: "Unrelevant",
            maxRateDescription: "Perfectly Relevant"
        });

        elements.push({
            title: "Who do you think write this question?",
            name: term.id + "_humanwritten",
            type: "rating",
            isRequired: true,
            minRateDescription: "Machine",
            maxRateDescription: "Human"
        });
        
        elements.push({
            title: "Is this question answerable by the passage?",
            name: term.id + "_answerability",
            type: "rating",
            isRequired: true,
            minRateDescription: "Unanswerable",
            maxRateDescription: "Answerable"
        });

        pages.push({ elements: elements });        

    });

    

   

    return {
        pages: pages,
        requiredText: "",
        showProgressBar: "bottom",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Follow<a href=" + constants.longtermTestCompletionURL + "> this link</a> back to Prolific Academic to confirm your participation.</h3>",
    }
};


export default QuestionQualityTest;
