import React from "react";
import { Tooltip } from "reactstrap";

/**
 * Renders a tooltip
 */
const InfoIcon = (props) => {
    const { id, tooltip } = props;

    const [isOpen, setOpen] = React.useState(false);

    return (
        <div
            style={{
                alignItems: "center",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <i id={id} className={"fa fa-info-circle"} />
            <Tooltip target={id} isOpen={isOpen} placement="right">
                {tooltip}
            </Tooltip>
        </div>
    );
};

export default InfoIcon;
