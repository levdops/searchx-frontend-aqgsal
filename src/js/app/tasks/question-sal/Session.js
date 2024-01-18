import React from "react";
import {Link} from "react-router-dom";
import SyncStore from "../../../stores/SyncStore";
import TaskedSession from "../components/session/TaskedSession";
import Collapsible from "react-collapsible";
import Timer from "../components/Timer";
import constants from "./constants";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Alert from "react-s-alert";

class Session extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
            finished: false,
        };

        this.onFinish = this.onFinish.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
    }

    componentDidMount() {
        var tdd = localStorage.getItem("task-data");
        if(tdd === undefined){tdd = "{}"};
        const taskdata = JSON.parse(tdd);
        //const taskdata = JSON.parse(localStorage.getItem("task-data") === undefined ? "{}" : localStorage.getItem("task-data")) || '';
        // console.error("session task data", tdd);
        // console.log("TOPIC", taskdata.topic);
        // console.log(taskdata.topic.description);
        let td = '<h3>Please take a minute to read your task description.</h3> <p> The professor requires all students to demonstrate what they learn about a particular topic by conducting searches online and presenting their views on the topic. </p>';
        td+=  taskdata.topic.description; //taskdata.topic ? taskdata.topic.description:'';
        // td += `Remember: there will be three intermittent tests. After searching for at least 20 minutes you can move on to the final test by clicking on the "To Final Test" button. 
        // The documents you saved will be available to you when writing (in your own words) a short summary about the topic.`

        var qid = taskdata.qid;
        var document_reading_desc = "Choose the documents that are helpful for your learning. Make sure to read the document and not just the snippet. You can read a document by clicking on the snippet. A document viewer will open and show the document to you."
        if (qid < 0){
            document_reading_desc += ' You can close the document by clicking on the "<b style="color:red">X</b>" in the top right corner.'; 
            document_reading_desc += ' <div align="center"> <img src ="/img/document_viewer.png" width="300" height="230"></div>';
        }
        else{
            document_reading_desc += ' <b class="text-primary">If you see a question at the bottom of the document, you are required to answer the question. </b>';
            document_reading_desc +=  '  <div align="center"> <img src ="/img/question_form.png" width="300" height="230"></div>';
        }
        const introSteps = [
            // {
            //     element: '.Task',
            //     intro: 'Please take a minute to read your task description.',
            //     position: 'left'
            // },
            {
                title: 'Your task',
                element: '.TaskDescription',
                intro: td
            },
            {
                element: '.SearchHeader',
                intro: 'We want you to use our custom web search system SearchX to learn about the topic mentioned in the task description for at least 20 minutes. Note that the "To Final Test" button will only be accessible after 20 minutes. You can search for longer if you want to know more about the given topic.',
                position: 'bottom-middle-aligned'
            },
            {
                element: '.SearchHeader .form',
                intro: 'Use SearchX to search for webpages, publications, and other online sources to learn about the topic. '
            },
            {
                title: 'Reading The Documents',
                element: '.SearchResults',
                intro: document_reading_desc,
                position: 'top'
            }
        ];     
        IntroStore.startIntro(introSteps, () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
                });
        });
        if (window.hasOwnProperty('LogUI')) {
            this.startLogUI();
        }     
    }


    startLogUI() {
        let variant = localStorage.getItem('variant');

        if (!variant) {
            variant = 'unknown';
        }

        let configurationObject = {
            logUIConfiguration: {
                endpoint: 'ws://logui.ewi.tudelft.nl/ws/endpoint/',
                authorisationToken: 'eyJ0eXBlIjoibG9nVUktYXV0aG9yaXNhdGlvbi1vYmplY3QiLCJhcHBsaWNhdGlvbklEIjoiNDIzMGQyZTQtM2Q1OS00NzdjLWEwMzQtOTMxNGUwYTdiZWFjIiwiZmxpZ2h0SUQiOiI3M2RiOWNhMi1jYmY4LTQ2ODAtOTFlZi00Y2E0MTA0ZGQzOTgifQ:1pRHWv:-3uKvpb-_N77qcJ0yTM3S9p0bxzrN7mCk48Q06kbfD0',
                verbose: false,

                browserEvents: {
                    blockEventBubbling: true,
                    eventsWhileScrolling: true,
                    URLChanges: true,
                    contextMenu: true,
                    pageFocus: true,
                    trackCursor: true,
                    cursorUpdateFrequency: 500,
                    cursorLeavingPage: true,
                    pageResize: true,
                }
            },
            applicationSpecificData: {
                userId: AccountStore.getUserId(),
                groupId: AccountStore.getGroupId(),
                variant: variant,
            },
            trackingConfiguration: {
                // Form and query box
                'query-box-hoverin': {
                    selector: 'form input',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'QUERY_BOX_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'QUERY_BOX_MOUSE_LEAVE',
                        }
                    },
                },

                'query-box-focus': {
                    selector: 'form input',
                    event: 'focus',
                    name: 'QUERY_BOX_FOCUS',
                },

                'query-box-blur': {
                    selector: 'form input',
                    event: 'blur',
                    name: 'QUERY_BOX_BLUR',
                },

                'query-box-keypress': {
                    selector: 'form input',
                    event: 'keyup',
                    name: 'QUERY_BOX_KEY',
                    metadata: [
                        {
                            nameForLog: 'QUERY_STRING',
                            sourcer: 'elementProperty',
                            lookFor: 'value',
                        }
                    ]
                },

                'form-submission': {
                    selector: 'form',
                    event: 'formSubmission',
                    name: 'FORM_SUBMISSION',
                    properties: {
                        includeValues: [
                            {
                                nameForLog: 'submittedQuery',
                                sourcer: 'elementProperty',
                                selector: 'form input',
                                lookFor: 'value',
                            }
                        ]
                    }
                },

                // QHW box hover in/out
                'qhw-hover': {
                    selector: '.QueryHistory > div',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'QHW_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'QHW_MOUSE_LEAVE',
                        }
                    },
                },

                // QHW previous query hover in/out
                'qhw-hover-item': {
                    selector: '.QueryHistory * .list .item .text a',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'QHW_QUERY_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'QHW_QUERY_MOUSE_LEAVE',
                        }
                    },
                    metadata: [
                        {
                            nameForLog: 'QUERY',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-query',
                        }
                    ]
                },

                // QHW previous query click
                'qhw-click-item': {
                    selector: '.QueryHistory * .list .item .text a',
                    event: 'click',
                    name: 'QHW_QUERY_CLICK',
                    metadata: [
                        {
                            nameForLog: 'QUERY',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-query',
                        }
                    ]
                },

                // QHW scrolling
                'qhw-scrolling': {
                    selector: '.QueryHistory *',
                    event: 'scrollable',
                    properties: {
                        scrollStart: {
                            name: 'QHW_SCROLL_START',
                        },
                        scrollEnd: {
                            name: 'QHW_SCROLL_END',
                        },
                    },
                },

                // Search result hover in/out
                'result-hover': {
                    selector: '.SearchResults .list > div div.SearchResult',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'RESULT_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'RESULT_MOUSE_LEAVE',
                        }
                    },
                    metadata: [
                        {
                            nameForLog: 'ID',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-id',
                        },
                        {
                            nameForLog: 'COLLECTION_ID',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-collectionid',
                        },
                        {
                            nameForLog: 'RANK',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-rank',
                        }
                    ]
                },

                // Search result click
                'result-click': {
                    selector: '.SearchResults .list > div div.SearchResult div div h2 a',
                    event: 'click',
                    name: 'RESULT_CLICK',
                },
                
                "result-reading":{
                    selector: '.viewer',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'READING_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'READING_MOUSE_LEAVE',
                        },
                    },
                    metadata: [
                        {
                            nameForLog: 'ID',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-id',
                        },
                        {
                            nameForLog: 'COLLECTION_ID',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-collectionid',
                        }
                    ]
                },
                "page-scrolling":{
                    selector: '.viewer *',
                    event: 'scrollable',
                    properties: {
                        scrollStart: {
                            name: 'PAGE_SCROLL_START',
                        },
                        scrollEnd: {
                            name: 'PAGE_SCROLL_END',
                        },
                    }
                },

                'answer-box-hoverin': {
                    selector: '#answerNav ',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'PAGE_ANSWER_BOX_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'PAGE_ANSWER_BOX_MOUSE_LEAVE',
                        }
                    },
                },

                'answer-box-focus': {
                    selector: '#answerTextV ',
                    event: 'focus',
                    name: 'ANSWER_BOX_FOCUS',
                },

                'answer-box-blur': {
                    selector: '#answerTextV ',
                    event: 'blur',
                    name: 'ANSWER_BOX_BLUR',
                },

                'answer-box-keypress': {
                    selector: '#answerTextV ',
                    event: 'keyup',
                    name: 'ANSWER_BOX_KEY',
                    metadata: [
                        {
                            nameForLog: 'QUERY_STRING',
                            sourcer: 'elementProperty',
                            lookFor: 'value',
                        }
                    ]
                },

            },
        };

        window.LogUI.init(configurationObject);
    }
    

    render() {
        const task = AccountStore.getTask();
        
        console.log("this state", this.state.start)
        const timer = (
            <div style={{marginTop: '10px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={false}/>
                
                
                <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/ssal/posttest" role="button">
                        To Final Test
                </Link>
            </div>
        );
        const metaInfo = {
            session: localStorage.getItem("session-num") || 0,

        };
        let handleTaskOpen = () => {
            log(LoggerEventTypes.TASK_OPEN, metaInfo);
        };

        let handleTaskClose = () => {
            log(LoggerEventTypes.TASK_CLOSE, metaInfo);
        };

        const taskDescription = (
            <Collapsible trigger="Your Task" open transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >
               <p>
                        The professor requires all students to demonstrate what they learn about a particular topic by
                         conducting searches online and presenting their views on the topic.
                     You need to use SearchX to learn about the topic. You must open and read documents/web pages that you think are 
                     important about the given topic.  
                     </p>

                     <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
                     <hr/>
                    <p> Remember: there will be three intermittent tests. After searching for at least 20 minutes you can move on to the final test by clicking on the "To Final Test" button. 
                        The documents you saved will be available to you when writing (in your own words) a short summary about the topic.
                    </p>


            </Collapsible>
        );

        return (
            <div>
                <TaskedSession 
                timer= {timer} 
                taskDescription={taskDescription} 
                onSwitchPage={this.onSwitchPage}
                lastSession={false} 
                firstSession={false}/>
            </div>
        )

        // return (
        //     <TaskedSession>
        //         <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
        //             <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
        //             <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/ssal/posttest" role="button">
        //                 To Final Test
        //             </Link>
        //         </div>

        //         <div className="box" style={{flexGrow: '1'}}>
        //             <h3 style={{textAlign: 'center'}}>Task Description</h3>
        //             <hr/>

        //             <p>
        //                 The professor requires all students to demonstrate what they learn about a particular topic by
        //                 collaboratively conducting searches online and presenting their views on the topic.
        //                 To prepare your term paper, your group needs to collect and save all the web pages,
        //                 publications, and other online sources that are helpful for you to write a paper.
        //             </p>

        //             <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
        //             <hr/>

        //             <p>
        //                 After you and your group have completed the search phase, you will be asked to complete 13
        //                 exercises;
        //                 those exercises include questions about your term paper topic and the writing of an outline for
        //                 your term paper.
        //                 The exercises are to be finished individually (without help from your group members).
        //             </p>
        //         </div>
        //     </TaskedSession>
        // )
    }

    ////

    onFinish() {
        // in this task, we do not adopt the intermiateTest, to keep it conssitent with the target paper. 
        let sessionNum = localStorage.getItem("session-num") || 0;

        localStorage.setItem("session-num", sessionNum);
        this.setState({
            finished: true
        });
        console.log("sessionNum", sessionNum)
    }
    
    onLeave() {
        log(LoggerEventTypes.SEARCH_EXIT, {
            step : "session",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }
    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-session") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-session", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "sessions",
            switch: switchTabs
        });
        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-session");

            Alert.error('You have been disqualified from the study.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        } else {
            Alert.error('We have noticed that you have tried to change to a different window/tab. Please, use SearchX only for your learning about the given topic!', {
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



export default Session;
