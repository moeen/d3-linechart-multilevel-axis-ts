import * as d3 from 'd3';

interface Data {
    date: number;
    value: number;
}

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 860 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
    (d) =>
        ({date: d3.timeParse("%Y-%m-%d")(d.date as string), value: d.value}))
    .then(data => {
        const quarterFormat = (date: Date) => {
            return 'Q' + Math.floor((date.getMonth() + 3) / 3);
        };
        const yearFormat = d3.timeFormat('%Y');

        const xDomain = d3.extent(data, d => d.date as Date) as [Date, Date];

        const x = d3.scaleTime()
            .domain(xDomain)
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`);


        const xAxisQuarter = d3.axisBottom(x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(quarterFormat as any);

        const xAxisYear = d3.axisBottom(x)
            .ticks(d3.timeYear)
            .tickFormat(yearFormat as any);


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + 30) + ")")
            .call(xAxisQuarter)
            .call(g => g.select(".domain").remove());

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxisYear);

        const yDomain = [0, d3.max(data, d => +(d.value as string)) as number];

        const y = d3.scaleLinear()
            .domain(yDomain)
            .range([height, 0]);

        svg.append("g").call(d3.axisLeft(y));

        const line = d3.line<any>()
            .x(d => x(d.date))
            .y(d => y(d.value));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line)
    });