import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {generateSnippetText,splitQuery} from '../../../../../utils/SimpleSnippetFragmentGenerator'
import SearchActions from '../../../../../actions/SearchActions';
import Alert from "react-s-alert";

////

const TextSearchResult = function ({
                                       searchState, serpId, index, result, metadata, bookmarkButton, excludeButton,
                                       urlClickHandler, hideCollapsedResultsHandler, isCollapsible, visited
                                   }) {
    let qid = localStorage.getItem("task-qid")?localStorage.getItem("task-qid"): Math.floor(Math.random() * 4)-1;
                            
    let metaInfo = {
        url: result.id,
        index: index,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
        qid: qid,
    };

    function highlight(text, target){
        return text.replace(new RegExp('(\\b)(' + target.join('|') + ')(\\b)', 'ig'), '$1<mark>$2</mark>$3');
    }

    let highlightWords = splitQuery(metaInfo.query);


    let clickUrl = () => {
        // console.log("CLICK DOC", result.QA)
        var doctext = highlight(result.content, highlightWords).split('\n').map((item, key) => {
            return (
		   <p dangerouslySetInnerHTML={{__html:item}}></p>
	    )
        })
        
        if (result.subheading != result.heading){
            doctext.unshift(<h5> {result.subheading} <br/></h5>);
        }
        doctext.unshift(<h4> {result.heading} </h4>);
        doctext.unshift(<h3> {result.name} </h3>);
        doctext.push(<div class="pt-5 pb-5"><br/><br/><hr></hr></div>);
        console.error("qid: ", qid);
        if (qid >= 0){
            doctext.push(

		    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-bottom mt-0 pm-5">
                <div class="mx-auto" id="answerNav">
                <form onSubmit={(e) => {
                    // if (e.target[0].value.length == 0){
                    //     // Alert.info("Please answer this question.", 
                    //     // {
                    //     //     position: 'bottom',
                    //     //     effect: 'scale',
                    //     //     beep: true,
                    //     //     timeout: 2000,
                    //     // });
                    //     return;
                    // }
                    e.preventDefault();
                    if (e.target[0].value.trim().length == 0) {
                        Alert.info("Please answer this question.", 
                        {
                            position: 'bottom',
                            effect: 'scale',
                            beep: true,
                            timeout: 2000,
                        });
                        return;
                    }
                    if(e.target[0].value === result.QA[qid].answer){
                        console.log("Correct")
                    } else {
                        console.log("Wrong")  
                    }
                    metaInfo.user_answer = e.target[0].value;
                    metaInfo.target_answer = result.QA[qid].answer;
                    log(LoggerEventTypes.ANSWER_QUESTION_CLICK, metaInfo);
                    SearchActions.closeUrl();
                }}>
		    <section class="d-flex justify-content-center justify-content-lg-between border-bottom">
                    <label style={{marginRight: 10+ 'px'}}> {result.QA[qid].question} </label>
		    </section>
		    <section>
                        <div class="input-group mb-3" width="100%">
                            <input type="text" class="form-control" aria-describedby="basic-addon2" id="answerTextV"></input>
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
                            </div>
                        </div>                                                
		    </section>
                </form>     
                </div>
		    </nav>
            );
        }
        urlClickHandler(result.id, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };
    function myfunction(){
        console.log("SUBMIT")
        // return false
    }

    let viewUrl = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    function createSnippet() {
        var text = result.content.trim().split('\n').join();
        if (!text.endsWith(".")){
            text = result.content + '.';
        }
        var    snippet = generateSnippetText(text, metaInfo.query);
        return {__html: snippet}; //generateSnippetText(text, metaInfo.query)}; 
    }

    const hideCollapsedResults = function () {
        const collapseMetaInfo = {
            urls: [result.id],
            query: searchState.query,
            page: searchState.page,
            serpId: serpId,
        };
        log(LoggerEventTypes.SEARCHRESULT_HIDE_COLLAPSED, collapseMetaInfo);
        const id = result.id ? result.id : result.url;
        hideCollapsedResultsHandler([id]);
    };

    const toTitleCase = function(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    if (result.name === result.name.toUpperCase()) {
        result.name = toTitleCase(result.name);
    }
    let cn
    if (index === 2 && localStorage.getItem("variant") === 'mid') {
        cn = "result-text-space";
    } else {
        cn = "result-text";
    }
 

    // var part_id_parts = result.url == null? null : result.url.split("-")
    // var part_id = part_id_parts == null? 0: part_id_parts[part_id_parts.length-1]
    ////
    return (
        <div className={cn}>
            <VisibilitySensor
                onChange={viewUrl}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}
            {excludeButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
               <div> 
                <h2>
                    <a className={visited ? "visited" : ""} href="#/"  title={result.name} onClick={clickUrl}
                       onContextMenu={contextUrl}>
                        {result.title}
                        <p className="source"> {result.name + '>' + result.heading + '>' + result.subheading} </p> 
                    </a>
                </h2>
                </div>
                {isCollapsible ? (
                    <div className="textArea" draggable="true" role="button" onClick={hideCollapsedResults}>
                        <p dangerouslySetInnerHTML={createSnippet()} >
                        </p>

                        {/* {metadata} */}
                    </div>
                ) : (
                    <div className="textArea">
                        <div className="fakeSpace"></div>
                        <p dangerouslySetInnerHTML={createSnippet()}>
                        </p>

                        {/* {metadata} */}
                    </div>
                )}
            </div>
        </div>
    )
};

export default TextSearchResult;
