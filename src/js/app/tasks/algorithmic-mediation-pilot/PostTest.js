import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";

class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true',
            returnCode: Math.random().toString(36).substring(2, 10)
        };

        this.onComplete = this.onComplete.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    handleBeforeUnload(e) {
        if (!this.state.finished) {
            const dialogText = 'Leaving this page will quit the task, and cancel your payment. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    render() {
        const task = AccountStore.getTask();
        return <Form
            formData={formData(this.state.returnCode)}
            onComplete={this.onComplete}
            disableCopy={false}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data,
            returnCode: this.state.returnCode
        });

        localStorage.setItem('posttest-finish', true.toString());
        this.state.finished = true;
    }
}

const formData = function(returnCode) {
    let pages = [];
    let elements = [];

    ////

    elements.push({
        type: "html",
        name: "topic",
        html: `<h2>Exit Questionnaire</h2>`
    });


    elements.push({
        type: "html",
        name: "collab-feedback-description",
        html: "<b> We would like you to describe your search experience. </b>"
    });
    


    elements.push({
        title: "How many people did you just now collaborate with (not including yourself)?",
        name: "collaborate-number",
        type: "text",
        width: 600,
        inputType: "number",
        isRequired: true
    });


    elements.push({
        title: "The color coding of the query history and bookmarks made sense to me.",
        name: "color-coding",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "It was easy to understand why documents were retrieve in response to my queries.",
        name: "easy",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
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
        type: "html",
        name: "collab-feedback-description",
        html: "<b> We would also like you to describe your experience in collaborating with your partner. </b>"
    });

    elements.push({
        title: "Did you find the collaborative features useful?",
        name: "collab-rating",
        type: "matrix",
        isRequired: true,
        isAllRowRequired: true,

        columns: [
            {
                value: 1,
                text: "Strongly Disagree"
            }, {
                value: 2,
                text: "Disagree"
            }, {
                value: 3,
                text: "Neutral"
            }, {
                value: 4,
                text: "Agree"
            }, {
                value: 5,
                text: "Strongly Agree"
            }
        ],
        rows: [
            {
                value: "query-history",
                text: "Recent queries"
            }, {
                value: "bookmarks",
                text: "Saved documents"
            }, {
                value: "hidden-results",
                text: "Hiding saved and excluded results"
            }
        ]
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
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Use this code on Amazon MTurk: " + returnCode + "</h3>",
    }
};

export default PostTest;