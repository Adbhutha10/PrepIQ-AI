// ─────────────────────────────────────────────────────────────────────────────
// Simplified Context Pipeline (Replacing RAG)
// Since LLM context windows (e.g. Llama 3 8k/70k context) are large enough to 
// hold an entire resume and job description, we bypass the need for vector
// embeddings (and OpenAI API keys) entirely.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Directly injects the full text of the resume and job description as context.
 * Bypasses the need for semantic chunking and vector retrieval.
 */
const extractContextViaRAG = async (resumeText, jobDescription) => {
  try {
    return `Candidate Resume Context:
${(resumeText || 'Not provided').slice(0, 4000)}

Job Description Context:
${(jobDescription || 'Not provided').slice(0, 4000)}`;
  } catch (error) {
    console.error('Context Pipeline Error:', error);
    return `Fallback Context:\nJD: ${(jobDescription || '').slice(0, 1000)}\nResume: ${(resumeText || '').slice(0, 1000)}`;
  }
};

/**
 * Replaces targeted topic retrieval since we provide full context to the LLM anyway.
 */
const retrieveContextForTopic = async (vectorStore, topic) => {
  // Not needed when using full context injection
  return '';
};

// Dummy exports to prevent breaking other files that import these
const buildSemanticChunks = () => [];
const createAndStoreEmbeddings = async () => ({});

module.exports = { 
  extractContextViaRAG, 
  buildSemanticChunks, 
  createAndStoreEmbeddings, 
  retrieveContextForTopic 
};
