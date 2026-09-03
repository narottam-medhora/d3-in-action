/*************************************/
/*  Create and populate the filters  */
/*************************************/
const populateFilters = (data) => {
  // Create the filters here

  d3.select("#filters")
    .selectAll(".filter")
    .data(filters)
    .join("button")
    .attr("class", (d) => `filter ${d.isActive ? "active" : ""}`)
    .text((d) => d.label)
    .on("click", (e, d) => {
      if (!d.isActive) {
        filters.forEach((filter) => {
          filter.isActive = d.id === filter.id ? true : false;
        });

        d3.selectAll(".filter").classed("active", (filter) =>
          filter.id === d.id ? true : false,
        );

        updateHistogram(d.id, data);
      }
    });
};

/****************************/
/*   Update the histogram   */
/****************************/
const updateHistogram = (selectedFilter, data) => {
  // Update the histogram here

  const updatedData =
    selectedFilter === "all"
      ? data
      : data.filter((respondent) => respondent.gender === selectedFilter);

  const updatedBins = binGenerator(updatedData);

  d3.selectAll("#histogram rect")
    .data(updatedBins)
    .transition()
    .duration(1000)
    .delay(500)
    .ease(d3.easeQuadInOut)
    .attr("y", (d) => yScale(d.length))
    .attr("height", (d) => innerHeight - yScale(d.length));
};
