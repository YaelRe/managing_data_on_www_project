import React from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import {Root} from "@amcharts/amcharts5";

import * as am5xy from "@amcharts/amcharts5/xy"; // TODO: add another chart?

export interface ChartsComponentProps {
    pieChartsData: any[];
}

export const ChartsComponent: React.FC<ChartsComponentProps> = ({
    pieChartsData,
}) => {
    const chartRoot = React.useRef <Root|null>(null);

        React.useEffect(() => {
            const createPieChart = () => {
                chartRoot.current && chartRoot.current.dispose();
                chartRoot.current = am5.Root.new('pie-chart');

                let pieChart = chartRoot.current.container.children.push(
                    am5percent.PieChart.new(chartRoot.current, {})
                );
                let pieSeries = pieChart.series.push(
                    am5percent.PieSeries.new(chartRoot.current, {
                        name: "Series",
                        valueField: "votes",
                        categoryField: "answer"
                    })
                );
                pieSeries.data.setAll(pieChartsData);

                // let pieLegend = pieChart.children.push(am5.Legend.new(chartRoot.current, {
                //     centerX: am5.percent(50),
                //     x: am5.percent(50),
                //     layout: chartRoot.current.horizontalLayout
                // }));
                // pieLegend.data.setAll(pieSeries.dataItems);

            }; createPieChart();

    }, [pieChartsData]);


    return (
        <div className='charts-container' >
            <div id='pie-chart' className='pie-chart' />
        </div>
    );
};

export default ChartsComponent;