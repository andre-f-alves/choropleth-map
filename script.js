import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const educationDataEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

const countiesDataEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const countiesData = await d3.json(countiesDataEndpoint)
const educationData = await d3.json(educationDataEndpoint)

const width = 1200
const height = 700
const padding = {
  top: 50,
  right: 100,
  left: 150
}

const svg = d3.select('.svg-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed('choropleth-map', true)

const tooltip = d3.select('.svg-container')
  .append('div')
  .attr('id', 'tooltip')
  .classed('tooltip', true)

const [ minPercentage, maxPercentage ] = d3.extent(educationData, (d) => d.bachelorsOrHigher)

const colorScheme = d3.schemeGreens[9]

const interpolate = d3.interpolateRound(minPercentage, maxPercentage)
const thresholdValues = d3.range(8).map((value, _, array) => interpolate(value / array.length) / 100)

const colorScale = d3.scaleThreshold()
  .domain(thresholdValues)
  .range(colorScheme)

const xScale = d3.scaleLinear()
  .domain([thresholdValues[0], thresholdValues.slice(-1)])
  .range([2 * width / 3, width - padding.right])

const chartLegendAxis = d3.axisBottom(xScale)
  .tickValues(thresholdValues)
  .tickFormat(d3.format('.0%'))
  .tickSize(15)

const chartLegend = svg.append('g')
  .attr('transform', `translate(0, ${padding.top})`)
  .attr('id', 'legend')
  .call(chartLegendAxis)

chartLegend.insert('g', 'path.domain')
  .classed('colors', true)
  .selectAll('rect')
  .data(thresholdValues.slice(0, -1))
  .join('rect')
    .attr('x', d => xScale(d))
    .attr('y', 0)
    .attr('width', (d, i) => xScale(thresholdValues[i + 1]) - xScale(d))
    .attr('height', 10)
    .attr('fill', d => colorScale(d))

chartLegend.select('.domain')
  .remove()

const counties = topojson.feature(countiesData, 'counties')

const map = svg.append('g')
  .attr('transform', `translate(${padding.left}, ${padding.top + 20})`)
  .classed('map', true)

const paths = map.selectAll('path')
  .data(counties.features)
  .join('path')
    .attr('d', d3.geoPath())
    .attr('data-fips', d => d.id)
    .attr('data-education', d => {
      const { bachelorsOrHigher } = educationData.find(item => item.fips === d.id)
      return bachelorsOrHigher
    })
    .attr('fill', d => {
      const { bachelorsOrHigher } = educationData.find(item => item.fips === d.id)
      return colorScale(bachelorsOrHigher / 100)
    })
    .classed('county', true)

paths.on('mouseover', (event) => {
  const fips = Number(event.target.getAttribute('data-fips'))
  const { state, area_name, bachelorsOrHigher } = educationData.find(county => county.fips === fips)

  tooltip.classed('active', true)
    .attr('data-education', bachelorsOrHigher)
    .style('top', event.pageY + 'px')
    .style('left', event.pageX + 'px')
    .append('p')
    .text(`${area_name}, ${state}: ${bachelorsOrHigher}%`)
})

paths.on('mouseout', () => {
  tooltip.classed('active', false)
    .select('p')
      .remove()
})
