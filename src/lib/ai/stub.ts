/**
 * AI layer stub — intentionally unused for medical answers in MVP.
 *
 * Future LLM integration MUST:
 * 1. Retrieve claims + sources from the structured DB first (RAG).
 * 2. Only generate plain-language explanations that cite retrieved source IDs.
 * 3. Never invent study titles, PMIDs, statistics, approvals, or adverse effects.
 * 4. Run the deterministic emergency rules engine BEFORE any LLM call.
 * 5. Refuse to diagnose, prescribe, or advise starting/stopping prescription meds.
 * 6. Surface uncertainty explicitly ("we don't know yet", evidence level badges).
 * 7. Log prompts, retrieved sources, and outputs to audit_log.
 *
 * This module exists so the architecture is ready without enabling fabrication risk.
 */

export type FutureAiRequest = {
  userQuery: string;
  retrievedClaimIds: number[];
  retrievedSourceIds: number[];
  jurisdiction: string;
};

export type FutureAiResponse = {
  explanation: string;
  citedClaimIds: number[];
  citedSourceIds: number[];
  uncertaintyNotes: string[];
};

export async function generateCitedExplanation(
  req: FutureAiRequest
): Promise<FutureAiResponse> {
  void req;
  throw new Error(
    "LLM medical answers are disabled in MVP. Use structured DB + templates only."
  );
}

export const AI_MVP_POLICY =
  "MedEvidence MVP does not call external LLMs for medical content. All answers come from curated structured data with attached sources.";
