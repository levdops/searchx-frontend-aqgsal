import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";
import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Alert from "react-s-alert";
import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SearchStore from "../../search/SearchStore";
import SearchResultsContainer from "../../search/results/SearchResultsContainer";
import SearchActions from '../../../actions/SearchActions';
import QueryHistoryContainer from "../../search/features/queryhistory/QueryHistoryContainer";


class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true',
            activeDoctext: SearchStore.getActiveDoctext(),
            searchState: SearchStore.getSearchState(),
        progress: SearchStore.getSearchProgress(),
        serpId: SearchStore.getSerpId(),
        activeUrl: SearchStore.getActiveUrl(),
        test: true
        };

        this.onComplete = this.onComplete.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onLeave = this.onLeave.bind(this);
    }
    documentCloseHandler() {
        SearchActions.closeUrl();
    }

    render() {
        const task = AccountStore.getTask();
        window.globalPage=1;
        function keepMePosted(){
            var els = document.getElementsByClassName('btn-green');
            var hideme = document.getElementById("hideme");
            Array.prototype.forEach.call(els, function(el) {
                if (el.value === "Next" || el.value === "Previous") {
                    el.onclick=function(){
                        window.globalPage=window.globalPage===1?2:1;		
                    }
            }
            });
            if (hideme!=null){
                if (window.globalPage===1){
                    hideme.style.display="none";
                } else {
                    hideme.style.display="block";
                }
            }
            setTimeout(keepMePosted, 200);
        }
        setTimeout(keepMePosted, 2000);
        
        localStorage.setItem("post-test", 1);
        return (
        <div className="Form">
        <Form
            formData={formData(task.data.topics)}
            formValidation={formValidation}
            onSwitchPage={this.onSwitchPage}
            onComplete={this.onComplete}
            onLeave={this.onLeave}
            disableCopy={true}
        />
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer/>
                        </div>
        <div className="Side">
        <QueryHistoryContainer collaborative={this.props.collaborative} test={this.state.test}/>
        </div> 
        </div>
        )
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data
        });

        localStorage.setItem('posttest-finish', true.toString());
        this.setState({ finished :true});
    }
    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "postest",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }
    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-pretest") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-pretest", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "postest",
            switch: switchTabs
        });

        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-pretest");

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

const formValidation = function(sender, question) {
    if (question.name === 'summary') {
        const text = question.value;
        const c = text.split(" ").length;

        if (c < 100) {
            question.error = "You have written only " + c + " words, you need to write at least 100 words to complete the exercises.";
        }
    }
};

const formData = function(topic) {
    let pages = [];
    let elements = [];

    ////
    let sess= localStorage.getItem("session-num") || 0 ;
    const topickey = sess
    sess++

    elements.push({
        type: "html",
        name: "topic",
        html:  `<h2> Information Need ${sess} </h2>` +
        `<h3>Let's find out what you have learned about the topic from the last search session.</h3>` +
        `<h3>For the information need you just searched for, provide us with two queries that will help us find relevant information.</h3>`
    });
    const name = "Q-"+ topic[topickey]['@number'] +"-"+ topic[topickey]['query'];

    elements.push({
        type: "html",
        name: "information-need" + topickey,
        html: `<p> Information need: <b><i>${topic[topickey]['narrative']}</i></b></p>` 
    });
    
    elements.push({
        title: "Query 1:",
        name: name +' query1',
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });
    elements.push({
        title: "Query 2:",
        name: name +' query2',
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    pages.push({elements:  elements});

    ////


    elements = [];

    elements.push({
        type: "html",
        name: "searchx-feedback-description",
        html: "<b>We would also like you to describe your experience while using SearchX and taking part in our study. This information will help us in making SearchX better for future usage. It will also help us to analyze user experience during the study. </b>"
    });
   
    elements.push({
        title: "I didn't notice any inconsistencies when I used the system.",
        name: "inconsistencies",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "It was easy to determine if a document was relevant to a task.",
        name: "relevance",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "How difficult was this task?",
        name: "difficult",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very easy",
        maxRateDescription: "Very difficult"
    });

    elements.push({
        title: "Do you have any additional comments regarding SearchX?",
        name: "additional-comment",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: true
    });

    pages.push({elements:  elements});

    ////

    return {
        pages: pages,
        requiredText: "",
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Follow this <a href=" + constants.completionURL + "> link</a> back to Prolific Academic to confirm your participation.</h3>" ,
    }
};

export default PostTest;