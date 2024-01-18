import './Search.pcss';
import React from 'react';
import Collapsible from "react-collapsible";
import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';
import PropTypes from "prop-types";
import SearchHeaderContainer from './header/SearchHeaderContainer';
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarkContainer from "./features/bookmark/BookmarkContainer";
import Chat from "./features/chat/Chat";
import config from "../../config";
import MobileDetect from 'mobile-detect';
import Alert from "react-s-alert";
import AccountStore from "../../stores/AccountStore"

class Search extends React.Component {
    constructor(props) {
        super(props);


        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.checkDevice = this.checkDevice.bind(this);
    }
    checkDevice()  {
        const md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null) {
            
            console.log("I am here");
            // return (<div/>)
            Alert.warning('SearchX is optimized for desktop browsing.', {
                position: 'top',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    };
    componentDidMount() {
        // if (this.props.firstSession && config.interface.chat && this.props.collaborative) {
        //     sessionStorage.clear();
        //     Chat();
        // };
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // if (window.hasOwnProperty('LogUI')) {
        //     this.startLogUI();
        // }
    }

    
    

    componentWillUnmount() {
        if (this.props.lastSession && config.interface.chat && this.props.collaborative) {
            const messages = document.querySelector(".chat-content").innerHTML;
            log(LoggerEventTypes.CHAT_ARCHIVE, {
                messages: messages
            });

            const element = document.querySelector("#conversejs");
            element.parentElement.removeChild(element);
        };
        document.removeEventListener('visibilitychange', this.handleVisibilityChange, this.checkDevice);

        setTimeout(function() {
            if (window.hasOwnProperty('LogUI')) {
                if (window.LogUI.isActive()) {
                    window.LogUI.stop();
                }
            }
        }, 1000);
    }

    render() {
        // tl, ur, lr, bl, mid
       localStorage.setItem("variant", "tl")
        return (
            <div className="Search">
                {this.checkDevice()}
                <SearchHeaderContainer timer={this.props.timer} statusbar={this.props.statusbar} showAccountInfo={this.props.showAccountInfo}/>

                <div className="Content">
                {/* <QueryHistoryContainer collaborative={this.props.collaborative}/> */}
                    <div className="Main">
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer/>
                        </div>
                    </div>

                    {/* <div className="Side">
                        <QueryHistoryContainer collaborative={this.props.collaborative}/>
                        <BookmarkContainer collaborative={this.props.collaborative}/>
                    </div> */}

                    {this.props.taskDescription && (
                        <div className="Side">
                            {this.props.taskDescription}
                        </div>
                    )}

                </div>
               
                {/* <Chat/> */}
                <div className="Footer"> 
                
                    {/*<text-center">*/}
                    <p className='text'>
                        SearchX is optimized for desktop browsing. Read more about <a href="/about" target="_blank">SearchX</a>.
                    </p>
                </div>

            </div>
        )
    }
    handleVisibilityChange() {
        // if (document.visibilityState !== 'visible'){ //document.hidden) {
        //     console.error("change");
        //     this.props.onSwitchPage();
        // }        
        
        if (document.hidden) {
        
            
            this.props.onSwitchPage();
        }
    }
}
Search.propTypes = {
    onSwitchPage: PropTypes.func
};


Search.defaultProps = {
    collaborative: true,
    showAccountInfo: true,
    firstSession: true,
    lastSession: true,
    onSwitchPage: () => {},
};

export default Search;
