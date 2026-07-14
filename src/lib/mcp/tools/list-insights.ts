import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { insights } from "../../../data/insights";
import es from "../../../i18n/locales/es.json";

type Entry = { title?: string; excerpt?: string };
const dict = ((es as unknown as { insights?: Record<string, Entry> }).insights ?? {}) as Record<string, Entry>;

export default defineTool({
  name: "list_insights",
  title: "List insights",
  description:
    "List Ronda Privé insight articles (blog posts) with title and excerpt (Spanish). Optionally filter by category.",
  inputSchema: {
    category: z
      .enum(["trends", "cases", "product", "industry"])
      .optional()
      .describe("Filter by insight category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const rows = insights
      .filter((p) => (category ? p.category === category : true))
      .map((p) => {
        const key = p.titleKey.replace(/^insights\./, "").replace(/\.title$/, "");
        const entry = dict[key] ?? {};
        return {
          id: p.id,
          slug: p.slug,
          category: p.category,
          date: p.date,
          readTime: p.readTime,
          title: entry.title ?? "",
          excerpt: entry.excerpt ?? "",
          url: `https://rondaprive.com/es/insights/${p.slug}`,
        };
      });
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { insights: rows },
    };
  },
});