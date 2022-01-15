import React from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import {Root} from "@amcharts/amcharts5";

export interface PieChartComponentProps {
    pieChartsData: any[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
    pieChartsData,
}) => {
    const pieChartRoot = React.useRef <Root|null>(null);


        React.useEffect(() => {
            const createPieChart = () => {
                pieChartRoot.current && pieChartRoot.current.dispose();
                pieChartRoot.current = am5.Root.new('pie-chart');

                let pieChart = pieChartRoot.current.container.children.push(
                    am5percent.PieChart.new(pieChartRoot.current, {})
                );
                let pieSeries = pieChart.series.push(
                    am5percent.PieSeries.new(pieChartRoot.current, {
                        name: "Series",
                        valueField: "votes",
                        categoryField: "answer"
                    })
                );
                pieSeries.data.setAll(pieChartsData);

            }; createPieChart();

    }, [pieChartsData]);


    return (
        <div className='charts-container' >
            <div id='pie-chart' className='pie-chart' />
        </div>
    );
};

export default PieChartComponent;