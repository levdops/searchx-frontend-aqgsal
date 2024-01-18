import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Helpers from "../../../utils/Helpers";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SessionStore from "../../../stores/SessionStore";
import IntroStore from "../../../stores/IntroStore";
import FormContainer from "../components/form/FormContainer";
import Alert from "react-s-alert";


class LongterRetentionPostTest extends React.Component {
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
        const task = AccountStore.getTaskData();
        if (!task.topics) return <div/>;
        window.globalPage = 1;
        localStorage.setItem("post-test", 1);
        return (
            <div className="Form">
            <Form
                    formData={formData(task.topic)}
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
        log(LoggerEventTypes.SURVEY_LONGTERM_POST_TEST_RESULTS, {
            data: data
        });

        console.log("Long-term post test", localStorage.getItem("session-num"), data)
        
        
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

const formData = function (topic) {
    let pages = [];
    let elements = [];

    ////

    elements.push({
        type: "html",
        name: "topic",
        html: `<h2>Test 1</h2>` +
            `<h3>Let's see how much you remember.</h3>` +
            `<h3>Answer these questions about <b style ="color: #00A6D3;">${topic.title}</b>:</h3>`
    });

    Helpers.shuffle(topic.terms).forEach((term, idx) => {
        const name = "Q-" + topic.id + "-" + term;

        elements.push({
            title: "How much do you know about \"" + term + "\"?",
            type: "radiogroup",
            isRequired: true,
            name: name,
            choices: constants.choices
        });

        elements.push({
            title: "In your own words, what do you think the meaning is?",
            visibleIf: "{" + name + "} > 2",
            name: "meaning-" + idx,
            type: "text",
            inputType: "text",
            width: 500,
            isRequired: true,
        });
    });

    pages.push({ elements: elements });

   

    return {
        pages: pages,
        requiredText: "",
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Follow<a href=" + constants.longtermTestCompletionURL + "> this link</a> back to Prolific Academic to confirm your participation.</h3>",
    }
};


export default LongterRetentionPostTest;