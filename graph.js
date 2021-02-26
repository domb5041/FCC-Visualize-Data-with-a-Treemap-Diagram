const gameSalesFile =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

d3.json(gameSalesFile, function (error, data) {
    if (error) {
        throw error;
    }
    console.log(data);

    const w = 1000;
    const h = 1000;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('id', 'svg-area')
        .attr('width', w)
        .attr('height', h);

    const tooltip = d3
        .select('#chart')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    const treemap = d3
        .treemap()
        .size([w, h - 200])
        .paddingInner(1);

    const root = d3
        .hierarchy(data)
        .eachBefore(d => {
            d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
        })
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);

    console.log(root);

    treemap(root);

    const cell = svg
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

    cell.append('rect')
        .attr('id', d => d.data.id)
        .attr('class', 'tile')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.category))
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .on('mousemove', d => {
            tooltip.style('opacity', 0.9);
            tooltip
                .html(
                    'Name: ' +
                        d.data.name +
                        '<br>Category: ' +
                        d.data.category +
                        '<br>Value: ' +
                        d.data.value
                )
                .attr('data-value', d.data.value)
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('opacity', 0);
        });

    cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text(d => d);

    const legend = svg.append('g').attr('id', 'legend');

    var categories = root.leaves().map(function (nodes) {
        return nodes.data.category;
    });
    categories = categories.filter(function (category, index, self) {
        return self.indexOf(category) === index;
    });

    legend
        .selectAll('rect')
        .data(color.domain())
        .enter()
        .append('rect')
        .attr('x', (d, i) => 10 + i * 50)
        .attr('y', h - 100)
        .attr('width', 50)
        .attr('height', 20)
        .attr('class', 'legend-item')
        .style('fill', d => color(d));

    legend
        .selectAll('text')
        .data(color.domain())
        .enter()
        .append('text')
        .attr('x', (d, i) => 20 + i * 50)
        .attr('y', h - 105)
        .text(d => d);
});
