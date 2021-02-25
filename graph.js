const gameSalesFile =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

d3.json(gameSalesFile, function (error, data) {
    if (error) {
        throw error;
    }
    console.log(data);

    const w = 1000;
    const h = 800;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('id', 'svg-area')
        .attr('width', w)
        .attr('height', h);

    const treemap = d3.treemap().size([w, h]).paddingInner(1);

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
        .attr('data-value', d => d.data.value);

    cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text(d => d);

    // const legend = svg.append('g').attr('id', 'legend');

    // legend
    //     .selectAll('rect')
    //     .data(cScale.domain())
    //     .enter()
    //     .append('rect')
    //     .attr('x', (d, i) => p + i * 50)
    //     .attr('y', 5)
    //     .attr('width', 50)
    //     .attr('height', 20)
    //     .style('fill', d => cScale(d - 0.1));

    // legend
    //     .selectAll('text')
    //     .data(cScale.domain())
    //     .enter()
    //     .append('text')
    //     .attr('x', (d, i) => p + 45 + i * 50)
    //     .attr('y', 40)
    //     .text(d => d);
});
