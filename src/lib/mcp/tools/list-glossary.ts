import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { GLOSSARY_TERMS } from "../../../data/glossary";
import es from "../../../i18n/locales/es.json";

type Term = { term: string; definition: string };
const terms = ((es as unknown as { glossary?: { terms?: Record<string, Term> } }).glossary?.terms ?? {}) as Record<string, Term>;

export default defineTool({
  name: "list_glossary",
  title: "List glossary",
  description:
    "List Ronda Privé industry glossary terms with definitions (Spanish). Optionally filter by category or search text.",
  inputSchema: {
    category: z
      .enum(["sales", "venue", "tech", "spaces", "metrics"])
      .optional()
      .describe("Filter by glossary category."),
    search: z.string().optional().describe("Case-insensitive substring match on term or definition."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, search }) => {
    const q = search?.toLowerCase();
    const rows = GLOSSARY_TERMS
      .filter((g) => (category ? g.category === category : true))
      .map((g) => ({
        id: g.id,
        category: g.category,
        term: terms[g.id]?.term ?? g.id,
        definition: terms[g.id]?.definition ?? "",
      }))
      .filter((r) => (q ? r.term.toLowerCase().includes(q) || r.definition.toLowerCase().includes(q) : true));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { glossary: rows },
    };
  },
});