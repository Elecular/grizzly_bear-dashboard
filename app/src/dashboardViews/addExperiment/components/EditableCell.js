import React from "react";
import { Button, FormGroup, Input } from "reactstrap";

const EditableCell = (props) => {
    const {
        value,
        onValueChange,
        cellWidth,
        editible = true,
        dataTestId = undefined,
    } = props;

    const [edit, setEdit] = React.useState(false);
    const [showEditIcon, setShowEditIcon] = React.useState(false);

    const handleValueChange = (val) => {
        if (onValueChange && !onValueChange(val)) return;
        setEdit(false);
    };

    return (
        <div
            onMouseEnter={() => setShowEditIcon(true)}
            onMouseLeave={() => setShowEditIcon(false)}
            style={{
                width: cellWidth || "10rem",
            }}
        >
            <div
                style={{
                    display: "inline-block",
                }}
            >
                {edit ? (
                    <FormGroup>
                        <Input
                            type="text"
                            data-testid={`input-${dataTestId}`}
                            autoFocus
                            defaultValue={value}
                            onKeyDown={(ev) => {
                                if (ev.key === "Enter") {
                                    handleValueChange(ev.target.value);
                                } else if (ev.key === "Escape") {
                                    setEdit(false);
                                }
                            }}
                            onBlur={(ev) => handleValueChange(ev.target.value)}
                        />
                    </FormGroup>
                ) : (
                    <h5
                        onClick={() => setEdit(editible)}
                        data-testid={`text-${dataTestId}`}
                    >
                        {value}
                    </h5>
                )}
            </div>
            {!edit && editible && (
                <Button
                    className="btn-link btn-icon"
                    color="primary"
                    style={{
                        visibility:
                            showEditIcon || value.length === 0
                                ? "inherit"
                                : "hidden",
                    }}
                    onClick={() => setEdit(editible)}
                >
                    <i className="tim-icons icon-pencil" />
                </Button>
            )}
            {!editible && (
                <i
                    className="tim-icons icon-lock-circle"
                    color="muted"
                    data-testid={`icon-${dataTestId}`}
                    style={{
                        marginLeft: "0.5rem",
                        visibility: showEditIcon ? "inherit" : "hidden",
                    }}
                />
            )}
        </div>
    );
};

export default EditableCell;
