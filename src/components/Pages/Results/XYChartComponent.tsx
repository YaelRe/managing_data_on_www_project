import React from 'react';
import * as am5 from "@amcharts/amcharts5";
import {Root} from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export interface XYChartComponentProps {
    xyChartsData: any[];
}

export const XYChartComponent: React.FC<XYChartComponentProps> = ({
    xyChartsData,
}) => {
    const xyChartRoot = React.useRef <Root|null>(null);

        React.useEffect(() => {
            const createXyChart = () => {
                xyChartRoot.current && xyChartRoot.current.dispose();
                xyChartRoot.current = am5.Root.new('xy-chart');

                let xyChart = xyChartRoot.current.container.children.push(
                    am5xy.XYChart.new(xyChartRoot.current, {
                        panY: false,
                        layout: xyChartRoot.current.verticalLayout
                    })
                );

                let yAxis = xyChart.yAxes.push(
                    am5xy.ValueAxis.new(xyChartRoot.current, {
                        renderer: am5xy.AxisRendererY.new(xyChartRoot.current, {})
                    })
                );
                let xAxis = xyChart.xAxes.push(
                    am5xy.CategoryAxis.new(xyChartRoot.current, {
                        renderer: am5xy.AxisRendererX.new(xyChartRoot.current, {}),
                        categoryField: "poll"
                    })
                );
                xAxis.data.setAll(xyChartsData);

                let series = xyChart.series.push(
                    am5xy.ColumnSeries.new(xyChartRoot.current, {
                        name: "Series",
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: "users_answers_amount",
                        categoryXField: "poll"
                    })
                );
                series.data.setAll(xyChartsData);

            }; createXyChart();

    }, [xyChartsData]);


    return (
        <div className='charts-container' >
            <div id='xy-chart' className='xy-chart'/>
        </div>
    );
};

export default XYChartComponent;