import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from "moment";
import { Card } from 'reactstrap';
const chartColor = '#FFFFFF';

const options = {
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            ticks: {
                maxTicksLimit: 15
            }
        }]
    }
};

/**
 * Draws a graph that shows how the project is performing for the given user action
 */
const PerformanceGraphCard = ({ header, performanceStats, userAction }) => {
    const graphData = getGraphData(
        performanceStats,
        moment().subtract(30, "days"),
        userAction,
        header
    );

    return (
        <Card style={{padding: "1.5rem", "margin": "1.5rem"}}>
            <h4>{header}</h4>
            <Line data={graphData} options={options} />
        </Card>
    );
};

const getGraphData = (performanceStats, startDate, userAction, label) => {

    let data = [];
    let labels = [];
    for (let count = 0; count < 31; count++) {
        var date = startDate.add(1, "days").format("DD-MM-YYYY");
        var stat = performanceStats[`${date}:${userAction}`];
        data.push(stat ? (stat.amount / stat.numberOfSessions) : 0);
        labels.push(date);
    }
    return {
        labels: labels,
        datasets: [{
            label: label,
            borderColor: "#1d8cf8",
            pointBackgroundColor: "#1d8cf8",
            pointBorderWidth: 2,
            pointRadius: 4,
            fill: true,
            borderWidth: 2,
            data: data
        }]
    };
};

export default PerformanceGraphCard;
