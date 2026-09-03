d3.csv("src/data/weekly_temperature.csv", d3.autoType).then((data) => {
  drawLineChart(data);
});

function drawLineChart(data) {
  const margin = { top: 40, right: 170, bottom: 25, left: 40 };
  const width = 1000;
  const height = 500;

  const boundedWidth = width - margin.left - margin.right;
  const boundedHeight = height - margin.top - margin.bottom;

  const svg = d3
    .select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("border", "1px solid black");

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.date), d3.max(data, (d) => d.date)])
    .range([0, boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.max_temp_F)])
    .range([boundedHeight, 0]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  innerChart
    .append("g")
    .attr("class", "axis-x")
    .attr("transform", `translate(0, ${boundedHeight})`)
    .call(xAxis);

  d3.selectAll(".axis-x text")
    .attr("x", (d) => {
      const currentMonth = d;

      const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);

      return (xScale(nextMonth) - xScale(currentMonth)) / 2;
    })
    .attr("y", "10px")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "14px");

  const yAxis = d3.axisLeft(yScale);

  innerChart.append("g").attr("class", "axis-y").call(yAxis);

  d3.selectAll(".axis-y text")
    .attr("x", "-10px")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "14px");

  svg
    .append("text")
    .text("Temperature (°F)")
    .attr("y", 20)
    .style("fill", "#f9f9f9");

  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.avg_temp_F))
    .attr("r", 4)
    .style("fill", "tomato");

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(d.min_temp_F))
    .y1((d) => yScale(d.max_temp_F))
    .curve(d3.curveCatmullRom);

  innerChart
    .append("path")
    .attr("d", areaGenerator(data))
    .attr("fill", "#e0ab26")
    .attr("fill-opacity", 0.4);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.avg_temp_F))
    .curve(d3.curveMonotoneX);

  innerChart
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "tomato")
    .attr("stroke-width", 3);

  innerChart
    .append("text")
    .text("Average temperature")
    .attr("x", xScale(d3.max(data, (d) => d.date)) + 10)
    .attr("y", yScale(data[data.length - 1].avg_temp_F))
    .attr("dominant-baseline", "middle")
    .attr("fill", "tomato");

  innerChart
    .append("text")
    .text("Minimum temperature")
    .attr("x", xScale(data[data.length - 3].date) + 13)
    .attr("y", yScale(data[data.length - 3].min_temp_F) + 20)
    .attr("alignment-baseline", "hanging")
    .attr("fill", "tomato");

  innerChart
    .append("line")
    .attr("x1", xScale(data[data.length - 3].date))
    .attr("y1", yScale(data[data.length - 3].min_temp_F) + 3)
    .attr("x2", xScale(data[data.length - 3].date) + 10)
    .attr("y2", yScale(data[data.length - 3].min_temp_F) + 15)
    .attr("stroke", "tomato")
    .attr("stroke-width", 2);

  innerChart
    .append("text")
    .text("Maximum temperature")
    .attr("x", xScale(data[data.length - 4].date) + 13)
    .attr("y", yScale(data[data.length - 4].max_temp_F) - 20)
    .attr("fill", "tomato");

  innerChart
    .append("line")
    .attr("x1", xScale(data[data.length - 4].date))
    .attr("y1", yScale(data[data.length - 4].max_temp_F) - 3)
    .attr("x2", xScale(data[data.length - 4].date) + 10)
    .attr("y2", yScale(data[data.length - 4].max_temp_F) - 20)
    .attr("stroke", "tomato")
    .attr("stroke-width", 2);
}
