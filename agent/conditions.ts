import { MessagesAnnotation } from "@langchain/langgraph";

export function shouldContinue(state: typeof MessagesAnnotation.State | any) {
  const last = state.messages.at(-1);

  return last?.tool_calls?.length ? "tools" : "__end__";
}
