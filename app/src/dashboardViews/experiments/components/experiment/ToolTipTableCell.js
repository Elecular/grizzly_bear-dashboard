import React from "react";
import { Tooltip } from "reactstrap";

/**
 * Renders a table cell with tooltip. Given id must be unique
 */
const ToolTipTableCell = (props) => {
    const { id, text, tooltip } = props;

    const [isOpen, setOpen] = React.useState(false);

    return (
        <td
            style={{
                alignItems: "center",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div style={{ marginRight: "0.5rem", display: "inline-flex" }}>
                {text}
            </div>
            <i id={id} className={"fa fa-info-circle"} />
            <Tooltip target={id} isOpen={isOpen} placement="right">
                {tooltip}
            </Tooltip>
        </td>
    );
};

export default ToolTipTableCell;
