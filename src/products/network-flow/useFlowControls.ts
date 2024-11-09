import type { Graph } from "@graph/types";

const SOURCE_LABEL = "S";
const SINK_LABEL = "T";

export const useFlowControls = (graph: Graph) => {

  const getNewLabel = () => {
    const alphabetWithoutST = "ABCDEFGHIJKLMNOPQRUVWXYZ";
    const labels = graph.nodes.value.map(node => node.label);
    let label = 0;
    while (labels.includes(alphabetWithoutST[label])) label++;
    return alphabetWithoutST[label];
  }

  graph.subscribe('onNodeAdded', (node) => {
    node.label = getNewLabel();
  })

  const makeSource = (nodeId: string) => {
    const node = graph.getNode(nodeId);
    if (!node) return;
    node.label = SOURCE_LABEL;
  }

  const makeSink = (nodeId: string) => {
    const node = graph.getNode(nodeId);
    if (!node) return;
    node.label = SINK_LABEL;
  }

  return {
    makeSource,
    makeSink,
  }
};