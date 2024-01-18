import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";
import SyncStore from "../../../stores/SyncStore";

constants.candidate_topics = constants.candidate_topics.filter(item => item.value == constants.targetTopicValue);

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
        this.onLeave = this.onLeave.bind(this);
        var invalid_user = localStorage.getItem("invalid-user");
	var task = localStorage.getItem("task-data");
        if (invalid_user !== null){
            this.props.history.push('/disq');
        }
	if (task !== null){
	    localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
	}
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
        // const lesttopic = data['lesttopic'];
        // const besttopic = data['besttopic'];
        const besttopic = constants.candidate_topics[0].value;
        const lesttopic = constants.candidate_topics[0].value;
        console.error([besttopic, lesttopic]);
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);
        
        const taskParams = {
            groupSize: constants.groupSize,
            topicsSize: constants.topicsSize,
            bestTopic: besttopic,
            leastTopic: lesttopic,
        };
        // if (besttopic == lesttopic){
        //     this.onLeave();
        //     localStorage.setItem("invalid-user",1);
        //     this.props.history.push('/disq');
        //     localStorage.removeItem("switch-tabs-pretest");
        // }
        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            if (res) {
                
                if ('topic' in res.taskData) {
                    // already registered. so we reject this re-entrance.
	
	    	    localStorage.setItem("invalid-user",1);
            	    this.props.history.push('/disq');
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
        <h3>Search as Learning: spend about half an hour learning about a topic by searching the web with our search engine!</h3>
        
        <p> This study consists of one search phase and two tests (one test before the search phase and one post-test after it). Each test asks you different questions about your knowledge on one or more topics - please answer the questions truthfully. 
        Your payment is not affected by the number of correct or incorrect answers. 
        Most questions are multiple-choice questions, in the last test we ask you to write a summary about one topic too.
        <strong>You have to write the summary based on your memory of the knowledge that you learned during the search phase</strong>. </p>
        
        <p>During the search phase, we want you to use our custom web search system to learn about one topic –- you can find a description of your topic on the right-hand side of the search interface.         
        You are required to search for documents, read them and learn about that topic for at least 20 minutes–-our interface has a timer, so you can see how much time you already spent searching. 
        After 20 minutes you can move on to the final test by clicking on the <span style="background-color: #00A6D3"><font color="white">To Final Test</span></font> button. 
        You can also keep searching for a bit longer and then move on.</p>

        <p> We have a few important points: </p>
        <ol type="-">
            <li>
                <p>
                Only use the web search interface we provide. 
                Do not switch browser tabs–-after three tab switches we will cancel your participation.
                </p>
            </li>
            <li>
                <p>
                You can interact with the search results. 
                A click on a document snippet will open this document in our own document viewer. 
                <strong> There may be a question regarding the document you are reading. You are required to answer the question based on the document.</strong>
                Your payment is not affected by the number of correct or incorrect answers. However, we will check the answer quality and cancel your participation if we find meaningless or off-document answers.
                We know that this document viewer is not perfect, but please stick with it. 
                
                </p>
            </li>
            <li> 
                <p>
                Keep your searches on the topic and avoid searches on unrelated topics. 
                For example, if your topic is computer science, we consider searches for tomorrow's weather, the latest news on Brexit, movie reviews of the Avenger movies, as off-topic and will cancel your participation.
                </p>
            </li>
        </ol>
        <hr/>
        <p>Finally, a reminder before you continue:
        please read the task description on the right-hand side of the search interface carefully. </p>
        <p style="color:red"> <b> Do not change tabs and do not reload. These activities would make you disqualified. </b> </p>
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
        <img src ="/img/journey_2.jpeg" width="450" height="250">
        </div>
        
        `
    });

 

    elements.push({
        title: "How often do you learn about a scientific topic (see the examples above) by searching the web?",
        name: "web-previous",
        type: "radiogroup",
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


    var topics = constants.candidate_topics; //.sort(()=> 0.5 - Math.random()).slice(0, constants['topicsSize']); // Object.keys(candidate_topics).sort(()=> 0.5 - Math.random()).slice(0, constants['topicsSize']); // keys.sort(()=>.5-Math.random()).slice(0, constants.topicsSize);     
    // var topics = topics_keys.map((i)=>candidate_topics[i]);
    elements = [];
    elements.push({
        type: "html",
        name: "Choose Topic",
        html:
            `<h2>Test 1</h2>` +
            `<h3>Let's find out what you already know first.</h3>`
    });

    // let topics_for_choosing = [];
    // for (let i=0; i<topics.length; i++){
    //     if(topics[i].id != '0'){
    //         topics_for_choosing.push(topics[i].title)
    //     }
    // }
    console.log(topics)
    
    // elements.push({
    //     title: `Choose the topic that you are MOST familiar with?`,
    //     type: "radiogroup",
    //     isRequired: true,
    //     name: "besttopic",
    //     choices: topics, // topics_for_choosing
    // });
    // elements.push({
    //     title: `Choose the topic that you are LEAST familiar with? (different from the MOST familiar topic)`,
    //     type: "radiogroup",
    //     isRequired: true,
    //     name: "lesttopic",
    //     choices: topics.filter(t=>t!="{besttopic}"), // topics_for_choosing
    // });

    // pages.push({elements:  elements});


    ////

    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;
