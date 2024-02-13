import React from "react";
import {Link} from "react-router-dom";
import SyncStore from "../../../stores/SyncStore";
import TaskedSession from "../components/session/TaskedSession";
import Collapsible from "react-collapsible";
import constants from "./constants";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Alert from "react-s-alert";
import Timer from "../components/Timer";

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
        let td = "<h3> Your task (a reminder)</h3><p> We want you to search for \
        documents containing information about <b>wildlife extinction</b>.</p> \
        <p>A few years ago, a debate arose about the conservation of the \
        spotted owl in America, highlighting the U.S. efforts to prevent \
        the extinction of wildlife species. What is not well known is the \
        effort of other countries to prevent the demise of species native \
        to their countries. <b>What other countries have begun efforts to \
        prevent such declines? A relevant document will specify the country, the involved \
        species, and steps taken to save the species.</b></p>";

        const variant = localStorage.getItem('variant');
        const tip_location = `.QueryHistory .${variant}`
        const introSteps = [
            {
                element: '.Task',
                intro: 'Please take a minute to read your task description.',
                position: 'left'
            },
            {
                element: '.TaskDescription',
                intro: td
            },
            {
                element: '.Bookmarks',
                intro: 'Save a document that you think is relevant by clicking on the \
                yellow flag. If you want to de-select a document, click the yellow flag once more!',
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
                authorisationToken: 'eyJ0eXBlIjoibG9nVUktYXV0aG9yaXNhdGlvbi1vYmplY3QiLCJhcHBsaWNhdGlvbklEIjoiOWFiZWM4NTAtM2ViMy00NzQzLWJjMmEtMTU4NjI2MzA4ZTJhIiwiZmxpZ2h0SUQiOiJjZDc4MWVjOC1lNDcwLTRiOGQtOGFkOS0xZjA3MzQzMzEyYzcifQ:1p9z29:260u83Kt0XX5Kgy5lL2UV9f2yk_vj6yBZ74JiNJRzI8',
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
                
                // Rating hover in/out
                'result-rating-hover': {
                    selector: '.SearchResults .list > div div.SearchResult div span.rating',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'RESULT_RATING_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'RESULT_RATING_MOUSE_LEAVE',
                        }
                    },
                },


            },
        };

        window.LogUI.init(configurationObject);
    }


    render() {
        
        const task = AccountStore.getTask();
        console.log(task.data.topics);
        const sessionNum = localStorage.getItem("session-num") || 0;

        const timer = (
            <div style={{marginTop: '20px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em', float: 'right', paddingTop: '25px', position:"relative"}} showRemaining={false}/>
 
                
                <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to={"/qhw/posttest"} role="button" style={{float: 'left', marginLeft: '5px', marginTop: '30px'}}>
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
                        We require to find relevant documents regarding the following information need:
                </p>

                {/* <p ><b><i>"{ task.data.topics[1].description }"</i></b></p>  */}
                <hr/>

                <p>
                    After you are satisfied with your found documents, click the Finish button above to submit the documents which you found to be most resourceful for this particular information need.
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
    }

    ////

    onFinish() {
        // if (localStorage.session ==1):
        localStorage.setItem("variant", "ur")
        this.setState({
            finished: true
        });;
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
