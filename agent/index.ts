import { graph } from "./graph";
import { checkpointer } from "../utils/checkpointer";

export const app = graph.compile({ checkpointer });
