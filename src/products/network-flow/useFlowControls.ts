import type { GNode, Graph } from "@graph/types";
import { ref } from "vue";

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

  const captureNodeFn = (res: (value: GNode | PromiseLike<GNode>) => void) => (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (node) res(node);
  }

  const captureNode = async () => {
    graph.settings.value.userEditable = false;
    let captureFn;
    const node = await new Promise<GNode>((res) => {
      captureFn = captureNodeFn(res);
      graph.subscribe('onClick', captureFn);
    });
    if (captureFn) graph.unsubscribe('onClick', captureFn);
    graph.settings.value.userEditable = true;
    return node;
  }

  const makingSource = ref(false);
  const makeSource = async () => {
    makingSource.value = true;
    const node = await captureNode();
    graph.nodes.value.forEach(node => {
      if (node.label === SOURCE_LABEL) node.label = getNewLabel();
    });
    node.label = SOURCE_LABEL;
    makingSource.value = false;
  }

  const makingSink = ref(false);
  const makeSink = async () => {
    makingSink.value = true;
    const node = await captureNode();
    graph.nodes.value.forEach(node => {
      if (node.label === SINK_LABEL) node.label = getNewLabel();
    });
    node.label = SINK_LABEL;
    makingSink.value = false;
  }

  return {
    makeSource,
    makeSink,

    makingSource,
    makingSink,
  }
};

export type NetworkFlowControls = ReturnType<typeof useFlowControls>;