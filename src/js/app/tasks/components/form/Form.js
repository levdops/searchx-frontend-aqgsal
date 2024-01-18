import './Form.pcss'
import React from "react";
import PropTypes from 'prop-types';
import Alert from "react-s-alert";
import * as Survey from "survey-react/survey.react";
import FormContainer from "./FormContainer";

class Form extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleComplete = this.handleComplete.bind(this);
        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        //this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        //window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    render() {
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

        let survey = new Survey.Model(this.props.formData);
        survey.completedHtml = `<div class='message'>${survey.completedHtml}</div>`;
        
        return (
            <FormContainer>
                <div onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste}>
                    <Survey.Survey model={survey} onComplete={this.handleComplete} onValidateQuestion={this.props.formValidation}/>
                </div>
            </FormContainer>
        );
    }

    ////
    // handleResize(){
        
    //         console.log("resizing")
    //         let availHeight = window.screen.availHeight;
    //         let outerHeight = window.outerHeight;
            
    //         this.props.onResize(availHeight - outerHeight);

    // }

    handleComplete(res) {
        this.props.onComplete(res.data);
        // res.preventDefault();
        console.log(res)
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }

    handleCutCopyPaste(e) {
        if (this.props.disableCopy) {
            Alert.warning('You cannot copy and paste in this step.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none",
            });

            e.preventDefault();
        }
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'visible'){ //document.hidden) {
            this.props.onSwitchPage();
        }

    }
}

Form.propTypes = {
    formData: PropTypes.object.isRequired,
    formValidation: PropTypes.func,
    onComplete: PropTypes.func.isRequired,
    onSwitchPage: PropTypes.func,
    disableCopy: PropTypes.bool,
    //onResize: PropTypes.func,
};

Form.defaultProps = {
    formValidation: () => {},
    onSwitchPage: () => {},
    disableCopy: false,
    //onResize: () => {}
};

export default Form;