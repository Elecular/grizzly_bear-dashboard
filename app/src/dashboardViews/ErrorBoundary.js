import React, { Component } from "react";
import { Card } from "reactstrap";
import Message from "./Message";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }
    render() {
        if (this.state.error) {
            return (
                <Message
                    title="Unexpected Error"
                    message="We apologize but an unexpected error occured. Please refresh and try again."
                />
            );
        }
        return this.props.children;
    }

    componentDidCatch(err) {
        this.setState({
            error: true,
        });
    }
}

export default ErrorBoundary;
