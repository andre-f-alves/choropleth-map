import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const educationDataEndpoint = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

const countyDataEndpoint = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const countyData = await d3.json(countyDataEndpoint)
const educationData = await d3.json(educationDataEndpoint)

const width = 1000
const height = 1000
const padding = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}

const svg = d3.select('.svg-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed('choropleth-map', true)
