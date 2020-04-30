import React from "react";
import strings from "../../../localizedStrings/strings";

class VariablesInfo extends React.Component {
    render() {
        return (
            <div
                style={{
                    marginLeft: "1.5rem",
                    marginRight: "1.5rem",
                }}
            >
                {/*Header*/}
                <div
                    className="text-center"
                    style={{
                        marginTop: "1rem",
                        marginBottom: "2.5rem",
                    }}
                >
                    <h4>
                        {strings.addExperimentsTab.basicInfoComponent.subTitle}
                    </h4>
                </div>
            </div>
        );
    }

    isValidated() {
        return false;
    }
}

export default VariablesInfo;
