async function loadNLPModel() {
  const module = await import('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');
  return await module.load();
}

async function detectButtonsNLP(textNodes) {
  const model = await loadNLPModel();
  const labels = ['accept cookies', 'reject cookies', 'decline cookies', 'only necessary cookies'];

  const predictions = await Promise.all(
    textNodes.map(node =>
      model.embed([node.textContent, ...labels]).then(embeddings => {
        const [textEmbedding, ...labelEmbeddings] = embeddings.arraySync();
        const similarities = labelEmbeddings.map(label => cosineSimilarity(textEmbedding, label));
        const maxIdx = similarities.indexOf(Math.max(...similarities));
        return { node, label: labels[maxIdx], score: similarities[maxIdx] };
      })
    )
  );

  const accept = predictions.filter(p => p.label === 'accept cookies' && p.score > 0.6).map(p => p.node.parentElement);
  const reject = predictions.filter(p => ['reject cookies', 'decline cookies', 'only necessary cookies'].includes(p.label) && p.score > 0.6).map(p => p.node.parentElement);

  return { accept, reject };
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}