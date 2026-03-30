export interface FAQItem {
  id: string;
  category: 'general' | 'attendees' | 'organizers' | 'technical';
  questionKey: string;
  answerKey: string;
}

export const faqItems: FAQItem[] = [
  { id: 'faq-1', category: 'general', questionKey: 'faq.q1', answerKey: 'faq.a1' },
  { id: 'faq-2', category: 'general', questionKey: 'faq.q2', answerKey: 'faq.a2' },
  { id: 'faq-3', category: 'general', questionKey: 'faq.q3', answerKey: 'faq.a3' },
  { id: 'faq-4', category: 'technical', questionKey: 'faq.q4', answerKey: 'faq.a4' },
  { id: 'faq-5', category: 'organizers', questionKey: 'faq.q5', answerKey: 'faq.a5' },
  { id: 'faq-6', category: 'organizers', questionKey: 'faq.q6', answerKey: 'faq.a6' },
  { id: 'faq-7', category: 'attendees', questionKey: 'faq.q7', answerKey: 'faq.a7' },
  { id: 'faq-8', category: 'organizers', questionKey: 'faq.q8', answerKey: 'faq.a8' },
  { id: 'faq-9', category: 'organizers', questionKey: 'faq.q9', answerKey: 'faq.a9' },
  { id: 'faq-10', category: 'technical', questionKey: 'faq.q10', answerKey: 'faq.a10' },
  { id: 'faq-11', category: 'technical', questionKey: 'faq.q11', answerKey: 'faq.a11' },
  { id: 'faq-12', category: 'attendees', questionKey: 'faq.q12', answerKey: 'faq.a12' },
  { id: 'faq-13', category: 'general', questionKey: 'faq.q13', answerKey: 'faq.a13' },
];

export const faqCategories = ['general', 'attendees', 'organizers', 'technical'] as const;
