import React from 'react';

import AccountStore from "../../../stores/AccountStore";

import SessionActions from '../../../actions/SessionActions';
import SearchActions from "../../../actions/SearchActions";
import SearchStore from "../SearchStore";
import SearchResult from "./components/SearchResult";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';


export default class SearchResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.urlClickHandler = this.urlClickHandler.bind(this);
        this.bookmarkClickHandler = this.bookmarkClickHandler.bind(this);
        // this.bookmarkCheckHandler = this.bookmarkCheckHandler.bind(this);
        this.excludeClickHandler = this.excludeClickHandler.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if('metadata' in nextProps.result) {
            if (nextProps.result.metadata.bookmark) {
                nextProps.result.metadata.bookmark.userColor = AccountStore.getMemberColor(nextProps.result.metadata.bookmark.userId);
            }
        }
    }

    ////

    urlClickHandler(url, doctext) {
        SearchActions.openUrl(url, doctext);
        SearchStore.modifyMetadata(url, {
            views: this.props.result.metadata.views + 1
        });

        let visitedUrls = JSON.parse(localStorage.getItem('visited-urls'));
        if (visitedUrls) {
            visitedUrls[url] = true;
        } else {
            visitedUrls = {};
            visitedUrls[url] = true;
        }

        localStorage.setItem('visited-urls', JSON.stringify(visitedUrls));
    }
    
    bookmarkClickHandler() {

    };

    excludeClickHandler() {

    }

    ////

    render() {
        return <SearchResult
            searchState={this.props.searchState}
            serpId={this.props.serpId}
            index={this.props.index}
            result={this.props.result}
            urlClickHandler={this.urlClickHandler}
            bookmarkClickHandler={this.bookmarkClickHandler}
            // bookmarkCheckHandler = {this.bookmarkCheckHandler}
            provider={this.props.provider}
            collapsed={this.props.collapsed}
            excludeClickHandler={this.excludeClickHandler}
            hideCollapsedResultsHandler={this.props.hideCollapsedResultsHandler}
            isCollapsible={this.props.isCollapsible}
            visited={this.props.visited}
        />
    }
}