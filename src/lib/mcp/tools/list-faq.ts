import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { faqItems } from "@/data/faq";
import es from "@/i18n/locales/es.json";

const faqDict = ((es as { faq?: Record<string, string> }).faq ?? {}) as Record<string, string>;

export default defineTool({
  name: "list_faq",
  title: "List FAQ",
  description:
    "List Ronda Privé frequently asked questions with answers (Spanish). Optionally filter by category.",
  inputSchema: {
    category: z
      .enum(["general", "attendees", "organizers", "technical"])
      .optional()
      .describe("Filter by FAQ category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const rows = faqItems
      .filter((f) => (category ? f.category === category : true))
      .map((f) => ({
        id: f.id,
        category: f.category,
        question: faqDict[f.questionKey.replace(/^faq\./, "")] ?? "",
        answer: faqDict[f.answerKey.replace(/^faq\./, "")] ?? "",
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { faq: rows },
    };
  },
});