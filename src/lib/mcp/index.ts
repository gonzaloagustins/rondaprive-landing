import { defineMcp } from "@lovable.dev/mcp-js";
import listEventsTool from "./tools/list-events";
import getEventTool from "./tools/get-event";
import listFaqTool from "./tools/list-faq";
import listGlossaryTool from "./tools/list-glossary";
import listInsightsTool from "./tools/list-insights";

export default defineMcp({
  name: "ronda-prive-mcp",
  title: "Ronda Privé",
  version: "0.1.0",
  instructions:
    "Public tools for Ronda Privé (rondaprive.com), an event-monetization platform for arenas, festivals and venues. Use these tools to browse showcase events, look up FAQ answers, glossary terms and insight articles.",
  tools: [listEventsTool, getEventTool, listFaqTool, listGlossaryTool, listInsightsTool],
});