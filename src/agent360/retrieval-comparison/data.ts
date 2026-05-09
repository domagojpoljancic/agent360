export type RetrievalProvider =
  | 'OpenAI'
  | 'Cohere'
  | 'Voyage AI'
  | 'BAAI'
  | 'Intfloat'
  | 'HKUNLP'
  | 'Mistral'

export type EmbeddingModelRow = {
  id: string
  embeddingModel: string
  provider: RetrievalProvider
  dimensions: string
  avgRetrievalLatency: string
  costTier: 'Low' | 'Medium' | 'High' | 'Unknown'
  retrievalAccuracyTier: 'High' | 'Medium' | 'Unknown'
  multilingualSupport: 'Yes' | 'Partial' | 'No' | 'Unknown'
  storageEfficiency: 'High' | 'Medium' | 'Low'
  recommendedUseCase: string
  operationalStability: 'Excellent' | 'Strong' | 'Moderate' | 'Watch'
  sourceLabel: string
  sourceUrl: string
  notes: string
}

export type VectorDatabaseRow = {
  id: string
  vectorDb: string
  queryLatency: string
  availability: string
  scalingSupport: 'High' | 'Medium' | 'Unknown'
  hybridSearchSupport: 'Yes' | 'Partial' | 'No'
  regionReplication: 'Yes' | 'Partial' | 'No'
  costTier: 'Low' | 'Medium' | 'High'
  operationalStability: 'Excellent' | 'Strong' | 'Moderate' | 'Watch'
  bestUseCase: string
  sourceLabel: string
  sourceUrl: string
  notes: string
}

export type RetrievalStrategyRow = {
  id: string
  strategy: string
  retrievalSpeed: 'Very Fast' | 'Fast' | 'Moderate' | 'Slow'
  accuracyImpact: 'High' | 'Medium' | 'Low'
  tokenOverhead: 'Low' | 'Medium' | 'High'
  complexity: 'Low' | 'Medium' | 'High'
  recommendedWorkload: string
  notes: string
}

export const embeddingModelRows: EmbeddingModelRow[] = [
  {
    id: 'text-embedding-3-small',
    embeddingModel: 'text-embedding-3-small',
    provider: 'OpenAI',
    dimensions: '1536',
    avgRetrievalLatency: '90ms',
    costTier: 'Low',
    retrievalAccuracyTier: 'Medium',
    multilingualSupport: 'Yes',
    storageEfficiency: 'High',
    recommendedUseCase: 'FAQ and support retrieval',
    operationalStability: 'Excellent',
    sourceLabel: 'OpenAI embeddings docs',
    sourceUrl: 'https://platform.openai.com/docs/guides/embeddings',
    notes: 'Dimensions documented; latency is benchmark estimate.',
  },
  {
    id: 'text-embedding-3-large',
    embeddingModel: 'text-embedding-3-large',
    provider: 'OpenAI',
    dimensions: '3072',
    avgRetrievalLatency: '125ms',
    costTier: 'Medium',
    retrievalAccuracyTier: 'High',
    multilingualSupport: 'Yes',
    storageEfficiency: 'Medium',
    recommendedUseCase: 'Higher-accuracy enterprise search',
    operationalStability: 'Strong',
    sourceLabel: 'OpenAI embeddings docs',
    sourceUrl: 'https://platform.openai.com/docs/guides/embeddings',
    notes: 'Use where higher embedding fidelity is required.',
  },
  {
    id: 'cohere-embed-v3',
    embeddingModel: 'Cohere Embed v3',
    provider: 'Cohere',
    dimensions: '1024 (varies by mode)',
    avgRetrievalLatency: '115ms',
    costTier: 'Medium',
    retrievalAccuracyTier: 'High',
    multilingualSupport: 'Yes',
    storageEfficiency: 'High',
    recommendedUseCase: 'Enterprise multilingual retrieval',
    operationalStability: 'Strong',
    sourceLabel: 'Cohere embeddings docs',
    sourceUrl: 'https://docs.cohere.com/docs/embeddings',
    notes: 'Verify exact SKU and pricing in Cohere docs.',
  },
  {
    id: 'voyage-large-2',
    embeddingModel: 'Voyage Large 2',
    provider: 'Voyage AI',
    dimensions: '1024',
    avgRetrievalLatency: '130ms',
    costTier: 'Medium',
    retrievalAccuracyTier: 'High',
    multilingualSupport: 'Yes',
    storageEfficiency: 'High',
    recommendedUseCase: 'High-quality semantic retrieval',
    operationalStability: 'Strong',
    sourceLabel: 'Voyage model docs',
    sourceUrl: 'https://docs.voyageai.com/docs/embeddings',
    notes: 'Latency/cost tier is operational benchmark estimate.',
  },
  {
    id: 'bge-large-en-v1-5',
    embeddingModel: 'BGE-large-en-v1.5',
    provider: 'BAAI',
    dimensions: '1024',
    avgRetrievalLatency: '145ms',
    costTier: 'Low',
    retrievalAccuracyTier: 'High',
    multilingualSupport: 'No',
    storageEfficiency: 'High',
    recommendedUseCase: 'Self-hosted English retrieval',
    operationalStability: 'Moderate',
    sourceLabel: 'Hugging Face model card',
    sourceUrl: 'https://huggingface.co/BAAI/bge-large-en-v1.5',
    notes: 'Open model; infra setup drives availability/cost.',
  },
  {
    id: 'e5-large-v2',
    embeddingModel: 'E5-large-v2',
    provider: 'Intfloat',
    dimensions: '1024',
    avgRetrievalLatency: '140ms',
    costTier: 'Low',
    retrievalAccuracyTier: 'Medium',
    multilingualSupport: 'Partial',
    storageEfficiency: 'High',
    recommendedUseCase: 'Open-source semantic search',
    operationalStability: 'Moderate',
    sourceLabel: 'Hugging Face model card',
    sourceUrl: 'https://huggingface.co/intfloat/e5-large-v2',
    notes: 'Operational stability depends on serving stack.',
  },
  {
    id: 'instructor-xl',
    embeddingModel: 'Instructor XL',
    provider: 'HKUNLP',
    dimensions: '768',
    avgRetrievalLatency: '170ms',
    costTier: 'Low',
    retrievalAccuracyTier: 'Medium',
    multilingualSupport: 'Partial',
    storageEfficiency: 'High',
    recommendedUseCase: 'Instruction-tuned retrieval tasks',
    operationalStability: 'Moderate',
    sourceLabel: 'Hugging Face model card',
    sourceUrl: 'https://huggingface.co/hkunlp/instructor-xl',
    notes: 'Self-hosted profile; latency varies by hardware.',
  },
  {
    id: 'mistral-embed',
    embeddingModel: 'Mistral Embed',
    provider: 'Mistral',
    dimensions: 'N/A',
    avgRetrievalLatency: '120ms',
    costTier: 'Unknown',
    retrievalAccuracyTier: 'Unknown',
    multilingualSupport: 'Unknown',
    storageEfficiency: 'Medium',
    recommendedUseCase: 'General retrieval experimentation',
    operationalStability: 'Watch',
    sourceLabel: 'Mistral docs',
    sourceUrl: 'https://docs.mistral.ai/',
    notes: 'Verify exact embedding SKU/specs in provider docs.',
  },
]

export const vectorDatabaseRows: VectorDatabaseRow[] = [
  {
    id: 'pinecone',
    vectorDb: 'Pinecone',
    queryLatency: '70-140ms',
    availability: '99.9% target',
    scalingSupport: 'High',
    hybridSearchSupport: 'Yes',
    regionReplication: 'Partial',
    costTier: 'High',
    operationalStability: 'Strong',
    bestUseCase: 'Managed large-scale vector search',
    sourceLabel: 'Pinecone docs',
    sourceUrl: 'https://docs.pinecone.io/',
    notes: 'Latency varies significantly by index type and region.',
  },
  {
    id: 'weaviate',
    vectorDb: 'Weaviate',
    queryLatency: '80-160ms',
    availability: 'Self/Cloud dependent',
    scalingSupport: 'High',
    hybridSearchSupport: 'Yes',
    regionReplication: 'Partial',
    costTier: 'Medium',
    operationalStability: 'Strong',
    bestUseCase: 'Hybrid search with rich filters',
    sourceLabel: 'Weaviate docs',
    sourceUrl: 'https://docs.weaviate.io/',
    notes: 'Cloud and self-hosted profiles differ by setup.',
  },
  {
    id: 'qdrant',
    vectorDb: 'Qdrant',
    queryLatency: '65-130ms',
    availability: 'Self/Cloud dependent',
    scalingSupport: 'Medium',
    hybridSearchSupport: 'Yes',
    regionReplication: 'Partial',
    costTier: 'Medium',
    operationalStability: 'Excellent',
    bestUseCase: 'Cost-efficient production vector search',
    sourceLabel: 'Qdrant docs',
    sourceUrl: 'https://qdrant.tech/documentation/',
    notes: 'Strong low-latency profile in many benchmark setups.',
  },
  {
    id: 'pgvector',
    vectorDb: 'pgvector',
    queryLatency: '100-240ms',
    availability: 'DB dependent',
    scalingSupport: 'Medium',
    hybridSearchSupport: 'Partial',
    regionReplication: 'Yes',
    costTier: 'Low',
    operationalStability: 'Strong',
    bestUseCase: 'Simple vector search in PostgreSQL stack',
    sourceLabel: 'pgvector docs',
    sourceUrl: 'https://github.com/pgvector/pgvector',
    notes: 'Great for teams already standardized on Postgres.',
  },
  {
    id: 'chroma',
    vectorDb: 'Chroma',
    queryLatency: '110-220ms',
    availability: 'Deployment dependent',
    scalingSupport: 'Medium',
    hybridSearchSupport: 'Partial',
    regionReplication: 'No',
    costTier: 'Low',
    operationalStability: 'Moderate',
    bestUseCase: 'Prototyping and lightweight deployments',
    sourceLabel: 'Chroma docs',
    sourceUrl: 'https://docs.trychroma.com/',
    notes: 'Production reliability depends on architecture choices.',
  },
  {
    id: 'elasticsearch-vector',
    vectorDb: 'Elasticsearch Vector Search',
    queryLatency: '90-190ms',
    availability: 'High (cluster configured)',
    scalingSupport: 'High',
    hybridSearchSupport: 'Yes',
    regionReplication: 'Yes',
    costTier: 'High',
    operationalStability: 'Strong',
    bestUseCase: 'Hybrid keyword + vector enterprise search',
    sourceLabel: 'Elastic docs',
    sourceUrl: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html',
    notes: 'Strong for existing Elasticsearch estates.',
  },
  {
    id: 'milvus',
    vectorDb: 'Milvus',
    queryLatency: '75-170ms',
    availability: 'Self/Managed dependent',
    scalingSupport: 'High',
    hybridSearchSupport: 'Partial',
    regionReplication: 'Partial',
    costTier: 'Medium',
    operationalStability: 'Moderate',
    bestUseCase: 'Large-scale self-hosted vector systems',
    sourceLabel: 'Milvus docs',
    sourceUrl: 'https://milvus.io/docs',
    notes: 'Operational complexity higher in self-managed mode.',
  },
]

export const retrievalStrategyRows: RetrievalStrategyRow[] = [
  {
    id: 'semantic-search',
    strategy: 'Semantic Search',
    retrievalSpeed: 'Very Fast',
    accuracyImpact: 'Medium',
    tokenOverhead: 'Low',
    complexity: 'Low',
    recommendedWorkload: 'General FAQ and support retrieval',
    notes: 'Baseline strategy for most production assistants.',
  },
  {
    id: 'hybrid-search',
    strategy: 'Hybrid Search',
    retrievalSpeed: 'Fast',
    accuracyImpact: 'High',
    tokenOverhead: 'Medium',
    complexity: 'Medium',
    recommendedWorkload: 'Mixed keyword + semantic corpora',
    notes: 'Often best for long-form enterprise docs.',
  },
  {
    id: 'reranking',
    strategy: 'Reranking',
    retrievalSpeed: 'Moderate',
    accuracyImpact: 'High',
    tokenOverhead: 'High',
    complexity: 'Medium',
    recommendedWorkload: 'High-importance responses',
    notes: 'Enable selectively for complex intents.',
  },
  {
    id: 'metadata-filtering',
    strategy: 'Metadata Filtering',
    retrievalSpeed: 'Fast',
    accuracyImpact: 'Medium',
    tokenOverhead: 'Low',
    complexity: 'Low',
    recommendedWorkload: 'Policy and region-scoped retrieval',
    notes: 'Improves precision and compliance scope.',
  },
  {
    id: 'chunk-overlap',
    strategy: 'Chunk Overlap Strategy',
    retrievalSpeed: 'Moderate',
    accuracyImpact: 'Medium',
    tokenOverhead: 'High',
    complexity: 'Medium',
    recommendedWorkload: 'Dense technical documentation',
    notes: 'Balance overlap carefully to limit context bloat.',
  },
]
