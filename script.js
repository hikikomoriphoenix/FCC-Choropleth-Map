Promise.all([
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"),
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  ])
  .then(responses => {
    Promise.all(responses.map(response => response.json()))
      .then(([education, counties]) => showChoropleth(education, counties));
  })

function showChoropleth(education, counties) {
  const countiesData = topojson.feature(counties, counties.objects.counties).features;
  const w = 1000;
  const h = 600;
  const path = d3.geoPath();

  const colors = [
    "hsl(286, 100%, 90%)",
    "hsl(286, 100%, 80%)",
    "hsl(286, 100%, 70%)",
    "hsl(286, 100%, 60%)",
    "hsl(286, 100%, 50%)",
    "hsl(286, 100%, 40%)",
    "hsl(286, 100%, 30%)"
  ];

  const legend = d3.select("main")
    .append("svg")
    .attr("id", "legend")
    .attr("width", 140)
    .attr("height", 40);

  const xScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, 140])

  legend.selectAll("rect")
    .data([0, 10, 20, 30, 40, 50, 60])
    .enter()
    .append("rect")
    .attr("x", d => xScale(d))
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d, i) => colors[i]);

  legend.selectAll("text")
    .data([10, 20, 30, 40, 50, 60])
    .enter()
    .append("text")
    .attr("x", d => xScale(d))
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .style("font-size", "12px")
    .text(d => d);


  const svg = d3.select("main")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.append("g")
    .selectAll("path")
    .data(countiesData)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("fill", d => {
      const found = education.find(element => element.fips === d.id);
      const boh = found.bachelorsOrHigher;
      return boh > 60 ? colors[0] :
        boh > 50 ? colors[1] :
        boh > 40 ? colors[2] :
        boh > 30 ? colors[3] :
        boh > 20 ? colors[4] :
        boh > 10 ? colors[5] :
        colors[6];
    })
    .attr("d", path)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => {
      const found = education.find(element => element.fips === d.id);
      return found.bachelorsOrHigher;
    })
    .on("mouseover", d => {
      const countyEduc = education.find(element => element.fips === d.id);

      tooltip.style("opacity", 1)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .attr("data-education", countyEduc.bachelorsOrHigher)
        .html(`${countyEduc.area_name}, ${countyEduc.state}<br>
          Bachelors Or Higher: ${countyEduc.bachelorsOrHigher}%`);
    })
    .on("mouseout", d => {
      tooltip.style("opacity", 0);
    });

  const tooltip = d3.select("main")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
}
