import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { events } from "@/data/events";

export default defineTool({
  name: "get_event",
  title: "Get event details",
  description:
    "Get full details for one Ronda Privé event by id, including vendors and menus.",
  inputSchema: {
    id: z.string().min(1).describe("The event id (e.g. 'estereo-picnic-2026')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const event = events.find((e) => e.id === id);
    if (!event) {
      return {
        content: [{ type: "text", text: `No event found with id '${id}'.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(event, null, 2) }],
      structuredContent: { event },
    };
  },
});