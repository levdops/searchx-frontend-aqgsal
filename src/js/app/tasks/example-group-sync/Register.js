import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
    }

    render() {
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        />
    }

    ////

    onComplete(data) {
        console.log(data)
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });

        const userId = data['userId'].trim();
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);

        const taskParams = {
            groupSize: constants.groupSize,
            topicsSize: constants.topicsSize
        };

        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            if (res) {
                
                if ('topic' in res.taskData) {
                    this.props.history.push('/ssal/session');
                } else {
                    this.props.history.push('/ssal/pretest');
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
        <h3>Find the relevant documents!</h3>
        

        <hr/>
        <p> We want you to search and find relevant documents for the topic
        <b>Wildlife Extinction</b> in this task. </p>


        <p>You can interact with the search engine by issuing queries on the 
        query bar or clicking on previously submitted queries on the query 
        history widget. There are <b>over 150</b> relevant documents on the 
        topic. Mark documents that you think are relevant using the bookmark
         icon <i class="fa fa-bookmark-o" aria-hidden="true"></i> next to the 
         document title.</p>
        
        <p>We will be giving bonuses to the participants that identify the 
        most relevant documents, but only those. We do not expect you to find 
        all relevant documents. Marking non-relevant documents will therefore 
        hamper your chances of receiving a bonus.</b>
        <hr/>

        <h4> More information on the topic:</h4>
            <p>A few years ago, a debate arose about the conservation of the 
            spotted owl in America, highlighting the U.S. efforts to prevent 
            the extinction of wildlife species. What is not well known is the 
            effort of other countries to prevent the demise of species native 
            to their countries.  What other countries have begun efforts to 
            prevent such declines? </p>

            <p><b>A relevant item will specify the country, the involved 
            species, and steps taken to save the species.</b></p>
        
        <hr/>


        <p>During the search phase, we want you to use our custom web search 
        system to search about the topic –- you find a description of your topic 
        again on the right-hand side of the search interface. </br>
        Our search interface has a few items that should help you on your task
        –-we will introduce them to you on the next screen. </p>
    aa
        
        <p>You must search for documents, read them and mark the 
        ones that you think are relevant to the topic.
        When you are satisfied, you can click on the 
        <span style="background-color: #00A6D3"><font color="white">To Final Test</span></font>
        button to finish your session and go to a quick questionnaire about your experience.</p>

        <p> We have a few important points: </p>
        <ol type="-">
            <li>
                <p>
                <b>Only use the web search interface we provide.</b></br>
                Do not switch browser tabs–-after three tab switches we will cancel your participation.
                </p>
            </li>
            <li>
                <p>
                <b>You cannot interact with the search results. </b></br>
                We require you to judge the relevance of the document based on the snippet presented.
                You cannot click on the document title to open it. If you want more information, submit another query.
                </p>
            </li>
            <li> 
                <p>
                Keep your searches on the topic and avoid searches on unrelated topics.
                We will consider off-topic searches, like tomorrow's weather, news on politics, or movie reviews of the Black Widow movie, as off-topic and may cancel your participation.
                </p>
            </li>
        </ol>
        <hr/>
        <p>Finally, a reminder before you continue: please read the task description carefully on the right-hand side of the search interface. </p>
        `
    });

    pages.push({elements:  elements});

    ////

    elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration</h2>" +
        "<h3>First fill out this basic information about you.</h3>"
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
        title: "What is your highest academic degree so far?",
        name: "degree",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "High School or lower"},
            {value: 1, text: "Associate's degree(s) (e.g., AA AE, AFA, AS, ASN)"},
            {value: 2, text: "Bachelor's degree(s) (e.g., BA, BBA, BFA, BS)"},
            {value: 3, text: "Master's degree(s) (e.g., MA, MBA, MFA, MS, MSW)"},
            {value: 4, text: "Specialist degree(s) (e.g., EdS)"},
            {value: 5, text: "Applied or professional doctorate degree(s) (e.g., MD, DDC, DDS, JD, PharmD)"},
            {value: 6, text: "Doctorate degree(s) (e.g., EdD, PhD)"},
            {value: 7, text: "Other"}
        ]
    });

    elements.push({
        title: "For which subject areas do you have a {degree}?",
        visibleIf: "{degree} > 0 & {degree} < 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });
    elements.push({
        title: "What is your academic degree and for which subject areas do you have the degree ?",
        visibleIf: "{degree} == 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });

    elements.push({
        title: "Are you an English native speaker?",
        name: "english",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });
    elements.push({
        html: "<p> Check <a href ='http://www.uefap.com/test/', target='_blank'>this chart </a> to determine your English level. </p>",
        name: "english-chart",
        type: "html",
        visibleIf: "{english} == 0"
    });
    elements.push({
        title: "What is your level of English? ",
        visibleIf: "{english} == 0",
        name : "english-level",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "Beginner"},
            {value: 1, text: "Elementary"},
            {value: 2, text: "Intermediate"},
            {value: 3, text: "Upper-intermediate"},
            {value: 4, text: "Advanced"},
            {value: 5, text: "Proficiency"}
        ]
    });

    pages.push({elements:  elements});

    elements = [];
    
    elements.push({
        type: "html",
        name: "topic",
        html: 
        `<h3>Search as Learning</h3>
        <br/> People often search the web to learn about something---whether it is knowledge they require for work, their study or just for fun. For the next few questions, we want you to think about how often you use the web when learning something about a scientific topic (e.g. how does partial differentiation work? what is a qubit? how can you determine the water quality of a pond?).
        <br/>
        <br/>
        <div align="center">
        <img src ="img/journey_2.jpeg" width="450" height="250">
        </div>
        
        `
    });

 

    elements.push({
        title: "How often do you learn about a scientific topic (see the examples above) by searching the web?",
        name: "web-previous",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });



    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
        type: "html",
        html: "<b> Think about the most recent time you learned about a scientific topic by searching the web. </b>"
    });

    elements.push({
        title: "Describe what you were trying to learn.",
        name: "web-information-need",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "What are your preferred online resources (like Wikipedia, Coursera, Youtube etc.) to learn about a scientific topic?",
        name: "web-online",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

        elements.push({
        title: "What are your preferred offline resources (can be books, people, institutions) to learn about a scientific topic?",
        name: "web-offline",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    pages.push({elements:  elements});


    ////

    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;