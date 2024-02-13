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
// import QueryHistoryContainer from "../../search/features/queryhistory/QueryHistoryContainer";
// import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";


class PostTest extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     finished: localStorage.getItem('posttest-finish') === 'true',
        //     // activeDoctext: SearchStore.getActiveDoctext(),
        //     // searchState: SearchStore.getSearchState(),
        // // progress: SearchStore.getSearchProgress(),
        // // serpId: SearchStore.getSerpId(),
        // // activeUrl: SearchStore.getActiveUrl()
        // // test: true
        // };

        this.onComplete = this.onComplete.bind(this);
        // this.onSwitchPage = this.onSwitchPage.bind(this);
        // this.onLeave = this.onLeave.bind(this);
    }
    // documentCloseHandler() {
    //     SearchActions.closeUrl();
    // }

    render() {
        // resolutionCheck();
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        /> 

    }

    ////

    onComplete(data) {
        console.log(data)
        // e.preventDefault();
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data
        });

        // localStorage.setItem('posttest-finish', true.toString());
        this.setState({ finished :true});
                console.log(data)
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });
        SyncStore.emitSyncSubmit(data);
        this.props.history.push('/qhw/submission');
    }
//     onLeave() {
//         log(LoggerEventTypes.SURVEY_EXIT, {
//             step : "postest",
//             state : this.state
//         });

//         SyncStore.emitSyncLeave();
//         AccountStore.clearUserData();
//     }
//     onSwitchPage() {
//         let switchTabs = localStorage.getItem("switch-tabs-pretest") || 0;
//         switchTabs++;
//         localStorage.setItem("switch-tabs-pretest", switchTabs);
//         log(LoggerEventTypes.TAB_CHANGE, {
//             step: "postest",
//             switch: switchTabs
//         });

//         if (switchTabs >= constants.switchPageLimit) {
//             this.onLeave();
//             localStorage.setItem("invalid-user",1);
//             this.props.history.push('/disq');
//             localStorage.removeItem("switch-tabs-pretest");

//             Alert.error('You have been disqualified from the study.', {
//                 position: 'top-right',
//                 effect: 'scale',
//                 beep: true,
//                 timeout: "none"
//             });
//         } else {
//             Alert.error('We have noticed that you have tried to change to a different window/tab. Please, focus on completing the test.', {
//                 position: 'top-right',
//                 effect: 'scale',
//                 beep: true,
//                 timeout: "none"
//             });

//             Alert.warning(`Remember that more than ${constants.switchPageLimit} tab changes result in a disqualification. So far you have changed tabs ${switchTabs} time(s)`, {
//                 position: 'top-right',
//                 effect: 'scale',
//                 beep: true,
//                 timeout: "none"
//             });
//         }
//     }
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

const formData = function() {
    let pages = [];
    let elements = [];

    ////
    // elements = [];

    elements.push({
        type: "html",
        name: "searchx-feedback-description",
        html: "<b>We would  like you to describe your experience while using \
        SearchX and taking part in our study. This information will help us in\
         making SearchX better for future usage. It will also help us to\
         analyze user experience during the study. </b>"
    });

    elements.push({ 
        title: "What did you think about the position of the query history widget?",
        name: "query-widget-position",
        type: "rating",
        isRequired: true,
        minRateDescription: "Unexpected",
        maxRateDescription: "Expected",
        rateValues: [1,2,3,4,5,6,7]
    });
    elements.push({ 
        title: "Did the query history widget support you in your task?",
        name: "pragmatic1",
        type: "rating",
        isRequired: true,
        minRateDescription: "Obstructive",
        maxRateDescription: "Supportive",
        rateValues: [1,2,3,4,5,6,7]
    });
    elements.push({ 
        title: "Was the query history widget easy to use?",
        name: "pragmatic2",
        type: "rating",
        isRequired: true,
        minRateDescription: "Complicated",
        maxRateDescription: "Easy",
        rateValues: [1,2,3,4,5,6,7]
    });
    elements.push({ 
        title: "What did you think about the position of the query history widget in terms of helping you with the task?",
        name: "pragmatic3",
        type: "rating",
        isRequired: true,
        minRateDescription: "Inefficient",
        maxRateDescription: "Efficient",
        rateValues: [1,2,3,4,5,6,7]
    });
    elements.push({ 
        title: "Did you get confused by the query history widget?",
        name: "pragmatic4",
        type: "rating",
        isRequired: true,
        minRateDescription: "Confusing",
        maxRateDescription: "Clear",
        rateValues: [1,2,3,4,5,6,7]
    });

    elements.push({
        title: "Do you have any specific comment on the query history widget?",
        name: "query-widget-opinion",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: true,
        });
   
    elements.push({
        title: "I didn't notice any inconsistencies when I used the system.",
        name: "inconsistencies",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree",
        rateValues: [1,2,3,4,5,6,7]
    });

    elements.push({
        title: "It was easy to determine if a document was relevant to a task.",
        name: "relevance",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree",
        rateValues: [1,2,3,4,5,6,7]
    });

    elements.push({
        title: "How difficult was this task?",
        name: "difficult",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very easy",
        maxRateDescription: "Very difficult",
        rateValues: [1,2,3,4,5,6,7]
    });

    elements.push({
        title: "Do you have any additional comments regarding this experiment?",
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
        // showProgressBar: "bottom",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Follow this <a href=" + constants.completionURL + "> link</a> back to Prolific Academic to confirm your participation.</h3>" ,
    }
};

export default PostTest;