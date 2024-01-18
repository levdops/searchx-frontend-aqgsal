import './QueryHistory.pcss';
import React from 'react';
import QueryHistoryItem from "./QueryHistoryItem";
import QueryHistoryWindow from "./QueryHistoryWindow";

const QueryHistory = function({history, popup, clickHandler, popupHandler, test}) {
    const list = history.map((data, index) => {
        return <QueryHistoryItem
            key={index}
            data={data}
            clickHandler={clickHandler}
            test = {test}
        />
    });

    // tl, ur, lr, bl, mid

    return (
    <div className={"QueryHistory"}>
        <div className={"ur"}>
            <h3 className="banner" >
                <i className="fa fa-history medium"/> Recent queries
            </h3>

            <div className="list">
                {list}
            </div>

            <QueryHistoryWindow
                active={popup}
                list={list}
                closeHandler={popupHandler}
            />
            </div>
        </div>
    )
};

export default QueryHistory;
