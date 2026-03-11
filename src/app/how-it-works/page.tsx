export default function HowItWorksPage() {
  return (
    <div style={{ background: "skyblue", padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "auto" }}>
      
      <h1>How This AI RAG Search - Repo Search - Works!</h1>

<br/>
      <p>
        This demo implements a <b>Retrieval-Augmented Generation (RAG)</b> pipeline.
        The system retrieves relevant document fragments using vector search
        and then uses an LLM to generate a grounded answer.
      </p>
<br/>
      <h2>Pipeline Overview</h2>
      <pre style={{ margin: "50px", background: "yellow", color: "black",fontSize: 14, padding: "20px", borderRadius: "10px", width: "60%"}}>
{`User Question
     ↓
Note: Document Chunking & Embeddings done offline, 
  Indexed repo/Document Chunks in PineCone VectorDB
     ↓
Query Embedding → Vector Similarity Search
     ↓
Top(K) Relevant Chunks Retrieved
     ↓
Retrieval Augmented Prompt Created with 
  Retrieved Chunks & User Question
     ↓
LLM Generates Grounded RAG Answer`

}
      </pre>

      <h2>Step-by-Step Explanation</h2>
<br/>
      <h3>1. Document Chunking</h3>
      <p>
        Large documents are split into smaller chunks so that the system
        can search them effectively during retrieval.
      </p>

      <h3>2. Embeddings</h3>
      <p>
        Each document chunk is converted into a vector embedding.
        These embeddings represent semantic meaning in high-dimensional space.
      </p>

      <h3>3. Vector Search</h3>
      <p>
        When the user asks a question, the system converts the question
        into an embedding and retrieves the most similar document chunks.
      </p>

      <h3>4. Context Injection</h3>
      <p>
        The retrieved chunks are inserted into the LLM prompt as context.
        This grounds the answer in real document content.
      </p>

      <h3>5. LLM Answer Generation</h3>
      <p>
        The language model generates a final answer using the retrieved
        document context. This reduces hallucinations and improves accuracy.
      </p>
<br/>
      <h2>Key AI Concepts Demonstrated</h2>
      <pre style={{ margin: "50px", background: "yellow", color: "black",fontSize: 14, padding: "20px", borderRadius: "10px", width: "65%"}}>
      <ul>
        <li>Retrieval-Augmented Generation (RAG)</li>
        <li>Vector embeddings</li>
        <li>Semantic similarity search</li>
        <li>Context-grounded LLM responses</li>
      </ul>
</pre>
</div>
  );
}