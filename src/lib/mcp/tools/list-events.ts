import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { events } from "../../../data/events";

export default defineTool({
  name: "list_events",
  title: "List events",
  description:
    "List Ronda Privé showcase events (festivals, concerts, nightclubs, conferences). Optionally filter by status or category.",
  inputSchema: {
    status: z.enum(["active", "upcoming"]).optional().describe("Filter by event status."),
    category: z
      .enum(["festival", "concert", "nightclub", "conference", "bar"])
      .optional()
      .describe("Filter by event category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, category }) => {
    const rows = events
      .filter((e) => (status ? e.status === status : true))
      .filter((e) => (category ? e.category === category : true))
      .map((e) => ({
        id: e.id,
        name: e.name,
        venue: e.venue,
        city: e.city,
        status: e.status,
        category: e.category,
        features: e.features,
        rating: e.rating,
        attendees: e.attendees,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { events: rows },
    };
  },
});