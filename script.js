import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const educationDataEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

const countyDataEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const countyData = await d3.json(countyDataEndpoint)
const educationData = await d3.json(educationDataEndpoint)

const geojson = topojson.feature(countyData, 'counties')

const width = 1200
const height = 1000
const padding = {
  top: 150,
  right: 100,
  bottom: 100,
  left: 100
}

const svg = d3.select('.svg-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed('choropleth-map', true)

const map = svg.append('g')
  .attr('transform', `translate(${padding.left}, ${padding.top})`)
  .classed('map', true)

map.selectAll('path')
  .data(geojson.features)
  .join('path')
    .attr('d', d3.geoPath())
    .classed('county', true)
