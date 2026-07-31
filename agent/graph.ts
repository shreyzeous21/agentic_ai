import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { tools } from "../tools";
import { agentNode } from "./nodes";
import { shouldContinue } from "./conditions";

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", new ToolNode(tools))
  .addEdge("__start__", "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);
