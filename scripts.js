/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then(function (data) {
  const gdpData = data.data;
  const gdp = [];
  const date = [];
  gdpData.forEach((d) => {
    gdp.push(d[1]);
    date.push(d[0]);
  });

  const w = 800;
  const h = 400;
  const padding = 60;
  const barWidth = w / 275;

  const tooltip = d3
    .select('.chart')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  const overlay = d3
    .select('.chart')
    .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

  // x&y scale
  const newDate = date.map((el) => new Date(el));
  const xMax = new Date(d3.max(newDate));
  xMax.setMonth(xMax.getMonth() + 3);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(newDate), xMax])
    .range([0, w]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp, (d) => d)])
    .range([0, h]);

  let scaledGDP = [];
  scaledGDP = gdp.map((el) => yScale(el));

  // year quarter
  const years = date.map((el) => {
    let quarter;
    const temp = el.substring(5, 7);
    if (temp === '01') {
      quarter = 'Q1';
    } else if (temp === '04') {
      quarter = 'Q2';
    } else if (temp === '07') {
      quarter = 'Q3';
    } else if (temp === '10') {
      quarter = 'Q4';
    }
    return `${el.substring(0, 4)} ${quarter}`;
  });

  // chartContainer
  const svgChartContainer = d3
    .select('.chart')
    .append('svg')
    .attr('width', w + 100)
    .attr('height', h + 60);

  svgChartContainer
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -270)
    .attr('y', 85)
    .style('fill', '#7fe0a4')
    .text('Gross Domestic Product');

  // svg gdpBarChart
  d3.select('svg')
    .selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('data-date', (d, i) => date[i])
    .attr('data-gdp', (d, i) => gdp[i])
    .attr('class', 'bar')
    .attr('x', (d, i) => xScale(newDate[i]))
    .attr('y', (d) => h - d)
    .attr('width', barWidth)
    .attr('height', (d) => d)
    .attr('transform', 'translate(60, 0)')
    .on('mouseover', (d, i) => {
      overlay
        .transition()
        .duration(0)
        .style('opacity', 0.9)
        .style('height', `${d}px`)
        .style('width', `${barWidth}px`)
        .style('left', `${i * barWidth + 0}px`)
        .style('top', `${h - d + 83}px`)
        .style('transform', 'translateX(60px)');
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          `${years[i]}<br>$${gdp[i]
            .toFixed(1)
            .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion`
        )
        .attr('data-date', date[i])
        .style('left', `${i * barWidth + 30}px`)
        .style('top', `${h - 50}px`)
        .style('transform', 'translateX(60px)');
    })
    .on('mouseout', () => {
      overlay.transition().duration(0).style('opacity', 0);
      tooltip.transition().duration(200).style('opacity', 0);
    });

  // X-axis
  const xAxis = d3.axisBottom().scale(xScale);

  svgChartContainer
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(60, 400)`)
    .attr('id', 'x-axis');

  // Y-axis
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp, (d) => d)])
    .range([h, 0]);

  const yAxis = d3.axisLeft(yAxisScale);

  svgChartContainer
    .append('g')
    .call(yAxis)
    .attr('transform', 'translate(60, 0)')
    .attr('id', 'y-axis');
});
d3.select('#title').append('h2').text('United States GDP');
