import React from "react";
import { CITY_NODES, CITY_EDGES } from "@/lib/simulation/cityGraph";

interface CityMapProps {
  highlightedRoute?: string[];
  highlightedEdges?: string[];
  showTraffic?: boolean;
  showRiderLabels?: boolean;
  showDistances?: boolean;
  onNodeClick?: (nodeId: string) => void;
}

export default function CityMap(props: CityMapProps) {
  const { highlightedRoute = [], highlightedEdges = [], onNodeClick } = props;

  const getNodeColor = (type: string) => {
    switch (type) {
      case "store": return "#3B82F6";
      case "warehouse": return "#FACC15";
      case "hub": return "#A855F7";
      case "junction": return "#64748B";
      case "customer": return "#22C55E";
      default: return "#ffffff";
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#070C18]">
      <svg viewBox="0 0 900 550" className="w-full h-full">
        {/* Draw Edges */}
        {CITY_EDGES.map(edge => {
          const fromNode = CITY_NODES.find(n => n.id === edge.from);
          const toNode = CITY_NODES.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted = highlightedEdges.includes(edge.id) || highlightedEdges.includes(`${edge.to}-${edge.from}`);

          return (
            <line
              key={edge.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isHighlighted ? "#3B82F6" : "#1E2D45"}
              strokeWidth={isHighlighted ? 4 : 2}
            />
          );
        })}

        {/* Draw Nodes */}
        {CITY_NODES.map(node => {
          const isHighlighted = highlightedRoute.includes(node.id);
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => onNodeClick?.(node.id)}
              className={onNodeClick ? "cursor-pointer" : ""}
            >
              <circle
                r={10}
                fill={getNodeColor(node.type)}
                stroke={isHighlighted ? "#22C55E" : "transparent"}
                strokeWidth={isHighlighted ? 4 : 0}
              />
              <text
                y={20}
                fontSize={10}
                fill="#64748B"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
