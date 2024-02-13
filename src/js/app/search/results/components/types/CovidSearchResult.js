import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {generateSnippetText} from '../../../../../utils/SimpleSnippetFragmentGenerator'

////

const CovidSearchResult = function ({
                                       searchState, serpId, index, result, metadata, bookmarkButton, excludeButton,
                                       urlClickHandler, hideCollapsedResultsHandler, isCollapsible, visited
                                   }) {
    let metaInfo = {
        url: result.id,
        docno: result.collectionId,
        index: index,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
    };
    // console.log(result)
    let clickUrl = () => {
        console.log("CLICK DOC")
        var doctext = result.text.split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>
        })

        doctext.unshift(<h4> {result.source} <br/></h4>);
        doctext.unshift(<h3> {result.name} <br/></h3>);

        

        urlClickHandler(result.id, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrl = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    let hoverEnterSummary = () => {
        console.log("HOV DOC")
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    function createSnippet() {
        let snippet = result.snippet
        // console.log(snippet)
        let str =  snippet.split("<strong>...</strong>")
        let e = snippet.startsWith("<strong>...") ? 550/(str.length-2): 550/(str.length-1)
        
        let final = []
        str.forEach(s => {
          if (s.length < e) {
            final.push(s)
          } else {
          let fidx =Math.ceil(s.length - e )/2
          final.push(s.substr(fidx, e))
          }
        })
          
        
        console.log( ) 
        return {__html: final.join("...")};
        // return {__html: result.snippet}
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
    
    // const getAuthorString = function(str) {
    //     let author_string = '';
    //     let authors = str.split(";");
    //     if (authors.length > 5) {
            
    //         authors.forEach((element ,idx) => {
    //             // console.log(element)
    //             if(idx <=5) {
    //             author_string = author_string.concat(element, "; ")
    //             }
                
    //         });
    //         author_string = author_string.concat("...")
    //         return author_string
            
    //     } else {
    //         author_string = result.author
    //         return author_string
    //     }
    // }

    ////
    
    return (
        <div className="result-text">
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
                <h2>
                    <a className={visited ? "visited" : ""} href="#/"  title={result.name} onClick={clickUrl}
                       onContextMenu={contextUrl}>
                        {result.name}
                    </a>
                </h2>
                {/* <div>
                    <p> {getAuthorString(result.author)}. <i> {result.journal === "nan" ? "" : result.journal} </i> ({result.pubtime})  &nbsp;
                    <a href= {result.url} target="_blank" rel="noopener noreferrer"
                       onContextMenu={contextUrl}>
                         [Link]
                    </a>
                    </p>
                </div> */}

                {isCollapsible ? (
                    <div className="textArea" draggable="true" role="button" onClick={hideCollapsedResults}>
                        <p dangerouslySetInnerHTML={createSnippet()} >
                        </p>

                        {metadata}
                    </div>
                ) : (
                    <div className="textArea">
                        <div className="fakeSpace"></div>
                        <p dangerouslySetInnerHTML={createSnippet()}>
                        </p>

                        {metadata}
                    </div>
                )}

            </div>
        </div>
    )
};

export default CovidSearchResult;
