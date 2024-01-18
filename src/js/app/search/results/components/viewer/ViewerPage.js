import React from 'react';
// import Loader from 'react-loader';
// import isImage from 'is-image';

export default class ViewerPage extends React.Component {
    componentDidMount() {
        if (this.props.doctext) {
            this.props.loadHandler();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.doctext && nextProps.url !== this.props.url) {
            nextProps.loadHandler();
        }
    }
    
    createHTML(text) {
        return {__html: text};
    }
    

    render() {
        return (
            <div className="page">

                <div className={"textBackground"}>
                    <div className={"documentText"} >
                            {this.props.doctext}
                    
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="page">
              {this.props.doctext ? (
                        <div className={"textBackground"}>
                            <div className={"documentText"} >
                                    {this.props.doctext}                           
                            </div>
                        </div>
                    ) :
                    (
                        <div className={"textBackground"}>
                            <div className={"documentText"} id={"documentText"}>
                                {this.props.doctext}                        
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
};