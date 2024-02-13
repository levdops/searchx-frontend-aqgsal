import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";
import Alert from "react-s-alert";
import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SessionStore from "../../../stores/SessionStore";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
        // this.onResize = this.onResize.bind(this);
    }

    render() {
        resolutionCheck();
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        /> 

    }

    componentDidMount() {
        resolutionCheck();
        window.addEventListener('resize', resolutionCheck);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', resolutionCheck);
    }

    ////

    onComplete(data) {
        console.log(data)
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });
        SyncStore.emitSyncSubmit(data);
        const userId = data['userId'].trim();
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);


        const taskParams = {
            groupSize: constants.groupSize,
            topicsSize: constants.topicsSize
        };

        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            console.log("here?")
            console.log(res);
            if (res) {
                this.props.history.push('/qhw/session');
            }
        });
    }
    // onResize(thresh){

    //     console.log("resizing")
    //         if (thresh > 10 ){
    //             Alert.warning(`Your browser size is NOT OK! `, {
    //                 position: 'bottom',
    //                 effect: 'scale',
    //                 beep: true,
    //                 timeout: "none"
    //             });
    //         } else {
    //             Alert.success(`Your browser size is OK! You can continue!`, {
    //                 position: 'bottom',
    //                 effect: 'scale',
    //                 beep: true,
    //                 timeout: "none"
    //             });
                
    //         }
        
    // }
}

var resolutionCheck = function() {
    let availHeight = window.screen.availHeight;
    let outerHeight = window.outerHeight;

    let okay = document.querySelector('#resolution-okay');
    let bad = document.querySelector('#resolution-bad');
    let button = document.querySelector('input[type=button]');

    if (okay) {
        if ((availHeight - outerHeight > 10)){
            okay.hidden = true;
            bad.hidden = false;
            button.disabled = true;
        } else {
            okay.hidden = false;
            bad.hidden = true;
            button.disabled = false;
        }
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
        <h3> <img src ="/img/search.png" width="50" height="50"> Search for information about wildlife extinction!</h3>
        <hr/>

        <p> We want you to search for documents that contain information 
        about <b>wildlife extinction</b>. </p>
        
        <p>More concretely: A few years ago, a debate arose about the conservation of the 
            spotted owl in America, highlighting the U.S. efforts to prevent 
            the extinction of wildlife species. What is not well known is the 
            effort of other countries to prevent the demise of species native 
            to their countries. <b>What other countries have begun efforts to 
            prevent the decline of species native to their countries? A relevant document will specify the country, the involved 
            species, and steps taken to save the species.</b> </p>

        <hr/>

        <p> Our search engine looks similar to a web search engine. You can issue search queries in the search bar and 
        view your recently submitted queries in our Recent queries box. You cannot view the entire document though: please 
        just read the document snippet available for each search result and consider based on the snippet whether the 
        document contains information about the topic of <strong>wildlife extinction</strong>.

        
        
        <p>For this study, we ask you to identify, or <em>mark</em> some documents that you think are relevant to the 
        topic described above. You are permitted to mark at most 6 documents.
         The more relevant documents that you identify, the more likely you are to receive a bonus.</p>

         <p> <strong>Mark documents that you think are relevant by clicking on the yellow flag next to a
          document's title.</strong> This flag acts as a toggle: one click marks the document, a further click unmarks it. </p>

          <p>Remembering that you can only select a total of 6 documents, you may find that you want to unmark a previously marked document. This can be done by re-issuing previous queries using either the search box, or the <em>Recent queries</em> box. 
          Once you find the document you wish to unmark, simply click the flag next to its title.

        
        <p>We ask you to search for a minimum of 10 minutes. A timer on the right-hand corner of the
        screen will help you to keep track of time. After 10 minutes, when you are satisfied, you can click on the 
        <span style="background-color: #00A6D3"><font color="white">To Final Test</span></font>
        button to finish your session and go to a final short questionnaire.</p>

        <p>  <img src ="/img/error.png" width="50" height="50"> We have a few important points: </p>
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
                We ask you to judge the relevance of the document based on the snippet presented.
                </p>
            </li>
            <li> 
                <p>
                <strong>Keep your searches on the topic and avoid searches on unrelated topics.</strong>
                We will consider off-topic searches, like tomorrow's weather, news on politics, or movie reviews of the Black Widow movie, as off-topic and may cancel your participation.
                </p>
            </li>
            <li>
            
            <p id="resolution-okay">
                <span style="background-color: #2FC987;"><strong>Your browser's resolution is good.</strong></span>
                Please keep your browser window at this resolution through the duration of the study. <strong>If you resize your browser during the study, we may have to cancel your participation.</strong>
            </p>

            <p id="resolution-bad">
                <span style="background-color: #F16034"><strong>Please maximise your browser's window.</strong></span>
                Your browser's window is not big enough to run this study. <strong>If you have resized and you still see this message, try refreshing your browser. If you're running Windows and you still see this message, make sure your display scaling is set to 100% (Settings > System > Display > Scale and Layout).</strong>
            </p>
        </li>
        </ol>
        <hr/>   `
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
        visibleIf: "{degree} > 0 and {degree} < 7",
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

    elements.push({
        title: "What is your prior knowledge on the topic?",
        name: "prior",
        type: "rating",
        isRequired: true,
        minRateDescription: "Low",
        maxRateDescription: "High",
        rateValues: [1,2,3,4,5,6,7]
    });
    elements.push({
        title: "What do you think is the relevance of the topic to your life?",
        name: "relevance",
        type: "rating",
        isRequired: true,
        minRateDescription: "Low",
        maxRateDescription: "High",
        rateValues: [1,2,3,4,5,6,7]
    });

    elements.push({
        title: "How much interest do you have to search about the topic?",
        name: "interest",
        type: "rating",
        isRequired: true,
        minRateDescription: "Low",
        maxRateDescription: "High",
        rateValues: [1,2,3,4,5,6,7]
    });
    elements.push({
        title: "What do you think will be the difficulty level to come up with queries to search for this topic?",
        name: "difficulty",
        type: "rating",
        isRequired: true,
        minRateDescription: "Low",
        maxRateDescription: "High",
        rateValues: [1,2,3,4,5,6,7]
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