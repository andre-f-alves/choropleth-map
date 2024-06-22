import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const educationDataEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

const countiesDataEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const countiesData = await d3.json(countiesDataEndpoint)
const educationData = await d3.json(educationDataEndpoint)

const width = 1200
const height = 800
const padding = {
  top: 50,
  right: 100,
  left: 100
}

const svg = d3.select('.svg-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed('choropleth-map', true)

const [ minPercentage, maxPercentage ] = d3.extent(educationData, (d) => d.bachelorsOrHigher)

const colorScheme = d3.schemeGreens[9]

const interpolate = d3.interpolateRound(minPercentage, maxPercentage)
const thresholdValues = d3.range(8).map((value, _, array) => interpolate(value / array.length) / 100)

const colorScale = d3.scaleThreshold()
  .domain(thresholdValues)
  .range(colorScheme)

const xScale = d3.scaleLinear()
  .domain([thresholdValues[0], thresholdValues.slice(-1)])
  .range([ 2 * width / 3, width - padding.right])

const legendAxis = d3.axisBottom(xScale)
  .tickValues(thresholdValues)
  .tickFormat(d3.format('.0%'))
  .tickSize(15)

const legend = svg.append('g')
  .attr('transform', `translate(0, ${padding.top})`)
  .classed('legend', true)
  .call(legendAxis)

legend.selectAll('rect')
  .data(thresholdValues)
  .join('rect')
    .attr('x', d => xScale(d))
    .attr('y', 0)
    .attr('width', (d, i, nodes) => i < nodes.length - 1 ? xScale(thresholdValues[i + 1]) - xScale(d): 0)
    .attr('height', '10px')
    .attr('fill', d => colorScale(d))

const counties = topojson.feature(countiesData, 'counties')

const map = svg.append('g')
  .attr('transform', `translate(${padding.left}, ${padding.top + 20})`)
  .classed('map', true)

map.selectAll('path')
  .data(counties.features)
  .join('path')
    .attr('d', d3.geoPath())
    .classed('county', true)
