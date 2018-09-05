import './Search.pcss';
import React from 'react';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

import SearchHeaderContainer from './header/SearchHeaderContainer';
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarkContainer from "./features/bookmark/BookmarkContainer";
import Chat from "./features/chat/Chat";
import config from "../../config";
import SuggestionsContainer from "./features/querysuggestions/SuggestionsContainer";

class Search extends React.Component {
    componentDidMount() {
        if (this.props.firstSession && config.interface.chat && this.props.collaborative) {
            sessionStorage.clear();
            Chat();
        }
    }

    componentWillUnmount() {
        if (this.props.lastSession && config.interface.chat && this.props.collaborative) {
            const messages = document.querySelector(".chat-content").innerHTML;
            log(LoggerEventTypes.CHAT_ARCHIVE, {
                messages: messages
            });

            const element = document.querySelector("#conversejs");
            element.parentElement.removeChild(element);
        }
    }

    render() {
        return (
            <div className="Search">
                <SearchHeaderContainer timer={this.props.timer} showAccountInfo={this.props.showAccountInfo}/>

                <div className="Content">
                    <div className="Main">
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer/>
                        </div>
                    </div>

                    <div className="Side">
                        <QueryHistoryContainer collaborative={this.props.collaborative}/>
                        <BookmarkContainer collaborative={this.props.collaborative}/>
                    </div>

                    {this.props.taskDescription && (
                        <div className="Side">
                            {this.props.taskDescription}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="Footer">
                        About <a href="/about" target="_blank">SearchX</a>.
                    </p>
                </div>
            </div>
        )
    }
}

Search.defaultProps = {
    collaborative: true,
    showAccountInfo: true,
    firstSession: true,
    lastSession: true
};

export default Search;