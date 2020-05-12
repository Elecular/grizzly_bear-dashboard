import React from "react";
import { Card } from "reactstrap";

const Message = (props) => (
    <div className="content">
        <Card
            className="text-center"
            style={{
                width: "40em",
                padding: "2rem",
            }}
        >
            <h4>{props.title}</h4>
            <p>{props.message}</p>
        </Card>
    </div>
);

export default Message;
