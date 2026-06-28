import * as React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useAnimate, useAnimateBar, useDrawingArea } from '@mui/x-charts/hooks';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import Box from '@mui/material/Box';
import votestotal_sales from './votes.json';

const ReportBar = (props) => {

    const transactionList = props.transactionList;

    const scores = transactionList.data.map(user => user.total_sales);

    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    const percentage = transactionList.total_sales / 100;

    // FIXED: use highestScore instead of total_sales
    const pct = highestScore / 100;


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');


    return (
        <Box sx={{ width: '100%', height: 700 }}>  {/* make container bigger */}
            <Typography marginBottom={2}>

            </Typography>
            <BarChart
                height={700}
                margin={{ left: 120, right: 40 }}
                dataset={transactionList.data}
                series={[
                    {
                        id: 'total_sales',
                        dataKey: 'total_sales',
                        stack: 'voter total_sales',
                        valueFormatter: (value) => `${numberFormat(value) + " ---- " + (value / percentage).toFixed(2)}%`
                    },
                ]}
                layout="horizontal"
                xAxis={[
                    {
                        id: 'color',
                        min: lowestScore,
                        max: highestScore,
                        // max: 1000,
                        colorMap: {
                            type: 'piecewise',
                            thresholds: [(pct * 50), (pct * 85)],
                            colors: ['#d32f2f', '#78909c', '#1976d2'],
                        },
                        valueFormatter: (value) => `${numberFormat(value)}`,
                    },
                ]}
                barLabel={(v) => `${numberFormat(v.value) + " ---- " + (v.value / percentage).toFixed(2)}%`}
                yAxis={[
                    {
                        scaleType: 'band',
                        dataKey: 'date',
                        width: 140,
                    },
                ]}
                slots={{
                    legend: PiecewiseColorLegend,
                    barLabel: BarLabelAtBase,
                    bar: BarShadedBackground,
                }}
                slotProps={{
                    legend: {
                        axisDirection: 'x',
                        markType: 'square',
                        labelPosition: 'inline-start',
                        labelFormatter: ({ index }) => {
                            if (index === 0) {
                                return 'Lowest Total Sales';
                            }
                            if (index === 1) {
                                return 'Average';
                            }
                            return 'Highest Total Sales';
                        },
                    },
                }}
            />
        </Box>
    );
}

export function BarShadedBackground(props) {
    const { ownerState, skipAnimation, id, dataIndex, xOrigin, yOrigin, ...other } =
        props;
    const theme = useTheme();

    const animatedProps = useAnimateBar(props);
    const { width } = useDrawingArea();
    return (
        <React.Fragment>
            <rect
                {...other}
                fill={(theme.vars || theme).palette.text.primary}
                opacity={theme.palette.mode === 'dark' ? 0.05 : 0.1}
                x={other.x}
                width={width}
            />
            <rect
                {...other}
                filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
                opacity={ownerState.isFaded ? 0.3 : 1}
                data-highlighted={ownerState.isHighlighted || undefined}
                data-faded={ownerState.isFaded || undefined}
                {...animatedProps}
            />
        </React.Fragment>
    );
}

const Text = styled('text')(({ theme }) => ({
    ...theme?.typography?.body2,
    stroke: 'none',
    fill: (theme.vars || theme).palette.common.white,
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    textAnchor: 'start',
    dominantBaseline: 'central',
    pointerEvents: 'none',
    fontWeight: 600,
}));

function BarLabelAtBase(props) {
    const {
        seriesId,
        dataIndex,
        color,
        isFaded,
        isHighlighted,
        classes,
        xOrigin,
        yOrigin,
        x,
        y,
        width,
        height,
        layout,
        skipAnimation,
        ...otherProps
    } = props;

    const animatedProps = useAnimate(
        { x: xOrigin + 8, y: y + height / 2 },
        {
            initialProps: { x: xOrigin, y: y + height / 2 },
            createInterpolator: interpolateObject,
            transformProps: (p) => p,
            applyProps: (element, p) => {
                element.setAttribute('x', p.x.toString());
                element.setAttribute('y', p.y.toString());
            },
            skip: skipAnimation,
        },
    );

    return <Text {...otherProps} {...animatedProps} />;
}
export default ReportBar
