import * as d3 from 'd3';

export default function tableFactoryV2(_rows) {
  const rows = Array.from(_rows);
  const header = rows.shift(); // Remove the first element for the header

  const table = d3.select('body')
    .append('table')
    .attr('class', 'table');

  table.append('thead')
    .append('tr')
    .selectAll('td')
    .data(header)
    .enter()
      .append('th')
      .text(d => d);

  table.append('tbody')
    .selectAll('tr')
    .data(rows)
    .enter()
      .append('tr')
      .selectAll('td')
      .data(d => d)
      .enter()
        .append('td')
        .text(d => d);

  return {
    table,
    header,
    rows,
  };
}


export function tableFactoryV1(_rows) {
  const rows = Array.from(_rows);
  const header = rows.shift(); // Remove the first element for the header
  const data = rows; // Everything else is a normal data row

  const table = d3.select('body')
    .append('table')
    .attr('class', 'table');

  const tableHeader = table.append('thead')
    .append('tr');

  const tableBody = table.append('tbody');

  // Each element in "header" is a string.
  header.forEach(value => {
    tableHeader.append('th')
      .text(value);
  });

  // Each element in "data" is an array
  data.forEach(row => {
    const tableRow = tableBody.append('tr');

    row.forEach(value => {
      // Now, each element in "row" is a string
      tableRow.append('td')
        .text(value);
    });
  });


  return {
    table,
    header,
    data,
  };
}
