import React from "react";
import { Row, Col, Label } from "reactstrap";
import Select from "react-select";
import TransactionStats from "models/TransactionStats";
import strings from "localizedStrings/strings";
import TransactionResults from "./Results";
import ProductBreakDown from "./ProductBreakdown";

const translations = strings.experimentsTab.transactionAnalytics;

const TransactionAnalytics = React.memo((props) => {
    const { experimentStats, environment, segment } = props;
    const transactionStats = TransactionStats.Instantiate(experimentStats);

    return (
        <div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                >
                    {translations.summary}
                </h4>
                <TransactionResults
                    stats={transactionStats}
                    environment={environment}
                    segment={segment}
                />
            </div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
                >
                    {translations.productBreakDown}
                </h4>
                <ProductBreakDown
                    stats={transactionStats}
                    environment={environment}
                    segment={segment}
                />
            </div>
        </div>
    );
});

export default TransactionAnalytics;
