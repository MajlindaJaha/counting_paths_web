import React from "react";
import * as d3 from "d3";

interface CoordinateSystemProps {
  routes: string[];
}

const CoordinateSystem: React.FC<CoordinateSystemProps> = ({ routes }) => {
  return (
    <div className="grid place-items-center m-10 gap-3">
      <div className="coordinate-system grid grid-cols-4">
        {routes.map((route, index) => (
          <div key={index} className="coordinate-system__graph">
            <h3>Path {index + 1}</h3>
            <CoordinateGraph route={route} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CoordinateGraph: React.FC<{ route: string }> = ({ route }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const step = innerWidth / 10;
    console.log(step);
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.scaleLinear().domain([0, 10]).range([0, innerWidth]);

    const yAxis = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

    const xAxisGroup = g
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xAxis)
          .ticks(10)
          .tickFormat((d, i) => `${i}`)
      );
    console.log(xAxisGroup);
    const yAxisGroup = g.append("g").call(
      d3
        .axisLeft(yAxis)
        .ticks(10)
        .tickFormat((d, i) => `${i}`)
    );
    console.log(yAxisGroup);
    let x = 0;
    let y = 0;

    const lineGenerator = d3
      .line<number[]>()
      .x((d) => xAxis(d[0]))
      .y((d) => yAxis(d[1]));

    const pathData = route.split("").map((direction, index) => {
      if (direction === "E") x += 1;
      if (direction === "N") y += 1;
      return [x, y];
    });

    g.append("path")
      .datum(pathData)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);
  }, [route]);

  return <svg ref={svgRef}></svg>;
};

export default CoordinateSystem;
