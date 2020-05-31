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
    .attr("d", path);
}
