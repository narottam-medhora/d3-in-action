d3.csv("src/data/daily_precipitations.csv", d3.autoType).then((data) => {
  console.log("precipitation data", data);
  drawArc(data);
});

function drawArc(data) {
  const pieChartWidth = 300;
  const pieChartHeight = 300;

  const svg = d3
    .select("#arc")
    .append("svg")
    .attr("viewBox", `0 0 ${pieChartWidth} ${pieChartHeight}`);

  const innerChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`,
    );

  const numberOfDays = data.length;
  const numberOfDaysWithPrecipitation = data.filter(
    (d) => d.total_precip_in > 0,
  ).length;
  const percentageOfDaysWithPrecipitation = Math.round(
    (numberOfDaysWithPrecipitation / numberOfDays) * 100,
  );

  const angleDaysWithPrecipitations_deg =
    (percentageOfDaysWithPrecipitation * 360) / 100;

  const angleDaysWithPrecipitations_rad =
    (angleDaysWithPrecipitations_deg * Math.PI) / 180;

  const arcGenerator = d3
    .arc()
    .innerRadius(80)
    .outerRadius(120)
    .padAngle(0.02)
    .cornerRadius(6);

  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({
        startAngle: 0,
        endAngle: angleDaysWithPrecipitations_rad,
      });
    })
    .attr("fill", "#e0ab26");

  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({
        startAngle: angleDaysWithPrecipitations_rad,
        endAngle: Math.PI * 2,
      });
    })
    .attr("fill", "cornflowerblue");

  const centroid = arcGenerator
    .startAngle(0)
    .endAngle(angleDaysWithPrecipitations_rad)
    .centroid();

  console.log(centroid);

  innerChart
    .append("text")
    .text((d) => d3.format(".0%")(percentageOfDaysWithPrecipitation / 100))
    .attr("x", centroid[0])
    .attr("y", centroid[1])
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-weight", "500")
    .attr("fill", "white");
}
