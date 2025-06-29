// Modern SEO Analysis Engine for Max Your Points CMS
// Built for 2024+ SEO best practices

interface TopicModelingResult {
  coverage: number
  missingTerms: string[]
  searchIntent: 'informational' | 'transactional' | 'navigational' | 'commercial'
  semanticRelevance: number
  topicCompleteness: number
}

interface EEATAnalysis {
  experienceScore: number
  expertiseScore: number
  authorityScore: number
  trustScore: number
  signals: {
    authorCredentials: boolean
    citations: number
    firstPersonExperience: boolean
    dataPoints: number
    hasAuthorBio: boolean
    hasPublishDate: boolean
    hasUpdateDate: boolean
    hasSources: boolean
  }
}

interface SnippetOptimization {
  hasSnippetFormat: boolean
  snippetType: 'paragraph' | 'list' | 'table' | 'definition' | 'none'
  optimizationTips: string[]
  answerBoxPotential: number
}

interface ContentDepthAnalysis {
  uniqueInsights: number
  comprehensiveness: number
  freshness: {
    hasCurrentYear: boolean
    hasRecentData: boolean
    statisticsAge: string[]
  }
  userQuestions: string[]
  contentGaps: string[]
}

interface LinkAnalysis {
  internalLinkCount: number
  externalLinkCount: number
  linkRatio: number
  orphanedContent: boolean
  linkVelocity: number
  anchorTextDiversity: number
  authoritativeSources: number
}

interface ModernSEOAnalysis {
  score: number
  searchIntentMatch: TopicModelingResult
  eeatAnalysis: EEATAnalysis
  snippetOptimization: SnippetOptimization
  contentDepth: ContentDepthAnalysis
  linkProfile: LinkAnalysis
  readability: EnhancedReadability
  technicalSEO: TechnicalSEOAnalysis
  competitorInsights?: CompetitorAnalysis
}

interface EnhancedReadability {
  fleschKincaid: number
  gunningFog: number
  smog: number
  avgSyllablesPerWord: number
  passiveVoicePercentage: number
  transitionWords: number
  sentenceVariation: number
  jargonScore: number
}

interface TechnicalSEOAnalysis {
  estimatedLoadTime: number
  renderBlockingElements: string[]
  imageOptimization: {
    hasWebP: boolean
    hasLazyLoading: boolean
    hasSrcSet: boolean
    totalSize: number
  }
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
}

interface CompetitorAnalysis {
  avgWordCount: number
  avgBacklinks: number
  commonTopics: string[]
  contentGaps: string[]
  recommendedLength: number
}

// Modern SEO Scoring Weights (2024+)
const MODERN_SEO_WEIGHTS = {
  SEARCH_INTENT_MATCH: 25,      // Most important: Does content match user intent?
  CONTENT_QUALITY: 20,           // Including E-E-A-T signals
  TECHNICAL_SEO: 15,             // Including Core Web Vitals
  USER_EXPERIENCE: 15,           // Readability, structure, engagement
  KEYWORD_OPTIMIZATION: 10,      // Less important now (semantic search)
  LINK_PROFILE: 10,              // Internal/external linking strategy
  FRESHNESS: 5                   // Content recency and updates
} as const

// Knowledge Graph for Semantic Analysis
const TOPIC_KNOWLEDGE_GRAPH: Record<string, string[]> = {
  'travel': ['vacation', 'trip', 'destination', 'tourism', 'journey', 'explore', 'adventure'],
  'credit cards': ['rewards', 'points', 'miles', 'cashback', 'apr', 'credit score', 'benefits'],
  'hotels': ['accommodation', 'booking', 'reservation', 'luxury', 'budget', 'amenities', 'hospitality'],
  'airlines': ['flights', 'aviation', 'aircraft', 'airports', 'frequent flyer', 'business class', 'economy'],
  'seo': ['search engine', 'optimization', 'ranking', 'serp', 'organic traffic', 'keywords', 'backlinks'],
  'deals': ['discounts', 'offers', 'promotions', 'savings', 'sale', 'bargain', 'value']
}

// Search Intent Classification
export function classifySearchIntent(keyword: string): TopicModelingResult['searchIntent'] {
  const transactionalTerms = ['buy', 'purchase', 'deal', 'discount', 'price', 'cheap', 'best']
  const navigationalTerms = ['login', 'website', 'official', 'contact', 'customer service']
  const commercialTerms = ['review', 'comparison', 'vs', 'alternative', 'top', 'best']
  
  const lowerKeyword = keyword.toLowerCase()
  
  if (transactionalTerms.some(term => lowerKeyword.includes(term))) {
    return 'transactional'
  }
  if (navigationalTerms.some(term => lowerKeyword.includes(term))) {
    return 'navigational'
  }
  if (commercialTerms.some(term => lowerKeyword.includes(term))) {
    return 'commercial'
  }
  
  return 'informational'
}

// Semantic Keyword Analysis (replaces simple keyword density)
export function analyzeTopicCoverage(content: string, focusKeyword: string): TopicModelingResult {
  const lowerContent = content.toLowerCase()
  const searchIntent = classifySearchIntent(focusKeyword)
  
  // Find related terms for the focus keyword
  const relatedTerms = TOPIC_KNOWLEDGE_GRAPH[focusKeyword.toLowerCase()] || []
  
  // Calculate semantic relevance
  const foundTerms = relatedTerms.filter(term => lowerContent.includes(term.toLowerCase()))
  const semanticRelevance = foundTerms.length / Math.max(relatedTerms.length, 1)
  
  // Calculate topic completeness based on search intent
  const intentSpecificTerms = getIntentSpecificTerms(searchIntent)
  const intentCoverage = intentSpecificTerms.filter(term => 
    lowerContent.includes(term.toLowerCase())
  ).length / Math.max(intentSpecificTerms.length, 1)
  
  const missingTerms = relatedTerms.filter(term => !lowerContent.includes(term.toLowerCase()))
  
  return {
    coverage: Math.round(semanticRelevance * 100),
    missingTerms: missingTerms.slice(0, 5), // Top 5 missing terms
    searchIntent,
    semanticRelevance,
    topicCompleteness: intentCoverage
  }
}

function getIntentSpecificTerms(intent: TopicModelingResult['searchIntent']): string[] {
  switch (intent) {
    case 'transactional':
      return ['buy', 'purchase', 'order', 'checkout', 'payment', 'shipping']
    case 'commercial':
      return ['review', 'comparison', 'pros', 'cons', 'rating', 'testimonial']
    case 'navigational':
      return ['official', 'website', 'homepage', 'contact', 'about']
    case 'informational':
    default:
      return ['guide', 'how to', 'tutorial', 'tips', 'explanation', 'definition']
  }
}

// E-E-A-T Analysis (Experience, Expertise, Authority, Trust)
export function analyzeEEAT(content: string, author?: any): EEATAnalysis {
  const lowerContent = content.toLowerCase()
  
  // Experience indicators
  const experienceTerms = ['i tested', 'my experience', 'i tried', 'personally used', 'hands-on']
  const experienceScore = experienceTerms.filter(term => lowerContent.includes(term)).length
  
  // Expertise indicators
  const citations = (content.match(/\[(\d+)\]|\(\d{4}\)|according to/g) || []).length
  const dataPoints = (content.match(/\d+%|\d+ study|\d+ research|\d+ survey/g) || []).length
  
  // Authority indicators
  const authorCredentials = author?.bio?.includes('expert') || 
                          author?.credentials || 
                          author?.title?.includes('expert') || false
  
  // Trust indicators
  const hasSources = lowerContent.includes('according to') || 
                    lowerContent.includes('study') ||
                    lowerContent.includes('research')
  
  const signals = {
    authorCredentials,
    citations,
    firstPersonExperience: experienceScore > 0,
    dataPoints,
    hasAuthorBio: !!author?.bio,
    hasPublishDate: true, // Assuming we have this
    hasUpdateDate: !!author?.updatedAt,
    hasSources
  }
  
  // Calculate individual scores
  const experienceScoreCalc = Math.min(experienceScore * 20, 100)
  const expertiseScoreCalc = Math.min((citations * 10) + (dataPoints * 15), 100)
  const authorityScoreCalc = authorCredentials ? 100 : 50
  const trustScoreCalc = Object.values(signals).filter(Boolean).length * 12.5
  
  return {
    experienceScore: experienceScoreCalc,
    expertiseScore: expertiseScoreCalc,
    authorityScore: authorityScoreCalc,
    trustScore: Math.min(trustScoreCalc, 100),
    signals
  }
}

// Featured Snippet Optimization Analysis
export function analyzeSnippetOptimization(content: string): SnippetOptimization {
  const snippetFormats = {
    paragraph: /^.{40,320}[.!?]$/m, // Direct answer in 40-320 chars
    list: /<ol>|<ul>|\n\d+\.|^\*\s|\n-\s/m,
    table: /<table>|^\|.*\|$/m,
    definition: /^(what is|definition of).+:/im
  }
  
  const hasSnippetFormat = Object.values(snippetFormats).some(regex => regex.test(content))
  
  let snippetType: SnippetOptimization['snippetType'] = 'none'
  for (const [type, regex] of Object.entries(snippetFormats)) {
    if (regex.test(content)) {
      snippetType = type as SnippetOptimization['snippetType']
      break
    }
  }
  
  const optimizationTips: string[] = []
  
  if (!snippetFormats.paragraph.test(content)) {
    optimizationTips.push('Add a concise answer (40-320 characters) at the beginning')
  }
  if (!snippetFormats.list.test(content)) {
    optimizationTips.push('Include numbered or bulleted lists for step-by-step content')
  }
  if ((content.match(/#{1,3}\s/g) || []).length < 2) {
    optimizationTips.push('Use H2 and H3 headings to structure content for featured snippets')
  }
  
  // Calculate answer box potential
  const hasDirectAnswer = /^(the answer is|in summary|to summarize)/im.test(content)
  const hasQuestionFormat = /^(what|how|why|when|where|which)/im.test(content)
  const answerBoxPotential = (hasDirectAnswer ? 50 : 0) + (hasQuestionFormat ? 30 : 0) + (hasSnippetFormat ? 20 : 0)
  
  return {
    hasSnippetFormat,
    snippetType,
    optimizationTips,
    answerBoxPotential
  }
}

// Advanced Content Quality & Depth Analysis
export function analyzeContentDepth(content: string, focusKeyword: string): ContentDepthAnalysis {
  const currentYear = new Date().getFullYear()
  
  // Detect unique insights vs generic content
  const uniqueIndicators = ['however', 'surprisingly', 'interestingly', 'contrary to', 'our analysis shows']
  const uniqueInsights = uniqueIndicators.filter(indicator => 
    content.toLowerCase().includes(indicator)
  ).length
  
  // Calculate comprehensiveness based on topic coverage
  const relatedTerms = TOPIC_KNOWLEDGE_GRAPH[focusKeyword.toLowerCase()] || []
  const coveredTerms = relatedTerms.filter(term => content.toLowerCase().includes(term))
  const comprehensiveness = Math.round((coveredTerms.length / Math.max(relatedTerms.length, 1)) * 100)
  
  // Freshness analysis
  const hasCurrentYear = new RegExp(`${currentYear}|${currentYear - 1}`).test(content)
  const hasRecentData = /latest|recent|new|updated|current/i.test(content)
  const statisticsAge = extractDataDates(content)
  
  // Extract user questions from content
  const userQuestions = extractQuestions(content)
  
  // Identify content gaps
  const contentGaps = identifyMissingSubtopics(content, focusKeyword)
  
  return {
    uniqueInsights,
    comprehensiveness,
    freshness: {
      hasCurrentYear,
      hasRecentData,
      statisticsAge
    },
    userQuestions,
    contentGaps
  }
}

function extractDataDates(content: string): string[] {
  const dateMatches = content.match(/20\d{2}|19\d{2}/g) || []
  return [...new Set(dateMatches)].slice(0, 5) // Unique dates, max 5
}

function extractQuestions(content: string): string[] {
  const questionMatches = content.match(/[.!?]\s*([A-Z][^.!?]*\?)/g) || []
  return questionMatches.map(q => q.trim()).slice(0, 5) // Max 5 questions
}

function identifyMissingSubtopics(content: string, focusKeyword: string): string[] {
  const commonSubtopics: Record<string, string[]> = {
    'credit cards': ['annual fees', 'interest rates', 'rewards program', 'credit requirements'],
    'hotels': ['amenities', 'location', 'price range', 'booking policies'],
    'airlines': ['baggage policies', 'seat selection', 'frequent flyer program', 'route network'],
    'travel': ['budget planning', 'best time to visit', 'local customs', 'transportation']
  }
  
  const expectedTopics = commonSubtopics[focusKeyword.toLowerCase()] || []
  const missingTopics = expectedTopics.filter(topic => 
    !content.toLowerCase().includes(topic.toLowerCase())
  )
  
  return missingTopics
}

// Link Analysis & Internal Linking Strategy
export function analyzeLinkProfile(content: string, allArticles?: any[]): LinkAnalysis {
  const internalLinks = content.match(/href="\/[^"]+"/g) || []
  const externalLinks = content.match(/href="https?:\/\/[^"]+"/g) || []
  
  const wordCount = content.split(/\s+/).length
  const optimalLinkCount = Math.ceil(wordCount / 150) // 1 link per 150 words
  
  const authoritativeDomains = ['.gov', '.edu', 'wikipedia.org', 'reuters.com', 'bloomberg.com']
  const authoritativeSources = externalLinks.filter(link => 
    authoritativeDomains.some(domain => link.includes(domain))
  ).length
  
  // Simple anchor text diversity check
  const anchorTexts = content.match(/>[^<]*<\/a>/g) || []
  const uniqueAnchors = new Set(anchorTexts).size
  const anchorTextDiversity = anchorTexts.length > 0 ? uniqueAnchors / anchorTexts.length : 0
  
  return {
    internalLinkCount: internalLinks.length,
    externalLinkCount: externalLinks.length,
    linkRatio: internalLinks.length / Math.max(externalLinks.length, 1),
    orphanedContent: internalLinks.length === 0,
    linkVelocity: Math.abs(internalLinks.length + externalLinks.length - optimalLinkCount),
    anchorTextDiversity,
    authoritativeSources
  }
}

// Enhanced Readability Analysis
export function analyzeReadabilityComprehensive(content: string): EnhancedReadability {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0)
  
  // Flesch-Kincaid Grade Level
  const avgSentenceLength = words.length / Math.max(sentences.length, 1)
  const avgSyllablesPerWord = syllableCount / Math.max(words.length, 1)
  const fleschKincaid = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59
  
  // Gunning Fog Index
  const complexWords = words.filter(word => countSyllables(word) >= 3).length
  const gunningFog = 0.4 * (avgSentenceLength + 100 * (complexWords / Math.max(words.length, 1)))
  
  // SMOG Index
  const smog = 1.043 * Math.sqrt(complexWords * (30 / Math.max(sentences.length, 1))) + 3.1291
  
  // Passive voice detection
  const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are']
  const passiveCount = passiveIndicators.reduce((count, indicator) => 
    count + (content.toLowerCase().split(indicator).length - 1), 0
  )
  const passiveVoicePercentage = (passiveCount / Math.max(sentences.length, 1)) * 100
  
  // Transition words
  const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'consequently', 'additionally']
  const transitionCount = transitionWords.reduce((count, word) => 
    count + (content.toLowerCase().split(word).length - 1), 0
  )
  
  // Sentence length variation
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length)
  const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / Math.max(sentenceLengths.length, 1)
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / Math.max(sentenceLengths.length, 1)
  const sentenceVariation = Math.sqrt(variance)
  
  // Industry jargon detection (simplified)
  const jargonTerms = ['utilize', 'facilitate', 'implement', 'optimize', 'leverage', 'synergize']
  const jargonCount = jargonTerms.reduce((count, term) => 
    count + (content.toLowerCase().split(term).length - 1), 0
  )
  const jargonScore = (jargonCount / Math.max(words.length, 1)) * 1000 // Per 1000 words
  
  return {
    fleschKincaid: Math.round(fleschKincaid * 10) / 10,
    gunningFog: Math.round(gunningFog * 10) / 10,
    smog: Math.round(smog * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    passiveVoicePercentage: Math.round(passiveVoicePercentage * 10) / 10,
    transitionWords: transitionCount,
    sentenceVariation: Math.round(sentenceVariation * 10) / 10,
    jargonScore: Math.round(jargonScore * 10) / 10
  }
}

function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

// Main Modern SEO Analysis Function
export function analyzeModernSEO(
  content: string, 
  title: string, 
  metaDescription: string, 
  focusKeyword: string,
  author?: any,
  allArticles?: any[]
): ModernSEOAnalysis {
  // PLACEHOLDER IMPLEMENTATION - Real SEO engine will be a separate project
  
  // Return placeholder values instead of real calculations
  return {
    score: 0, // Always return 0 to indicate placeholder
    searchIntentMatch: {
      coverage: 0,
      missingTerms: ['This is a placeholder'],
      searchIntent: 'informational',
      semanticRelevance: 0,
      topicCompleteness: 0
    },
    eeatAnalysis: {
      experienceScore: 0,
      expertiseScore: 0,
      authorityScore: 0,
      trustScore: 0,
      signals: {
        authorCredentials: false,
        citations: 0,
        firstPersonExperience: false,
        dataPoints: 0,
        hasAuthorBio: false,
        hasPublishDate: false,
        hasUpdateDate: false,
        hasSources: false
      }
    },
    snippetOptimization: {
      hasSnippetFormat: false,
      snippetType: 'none',
      optimizationTips: ['SEO engine placeholder - Real engine coming soon'],
      answerBoxPotential: 0
    },
    contentDepth: {
      uniqueInsights: 0,
      comprehensiveness: 0,
      freshness: {
        hasCurrentYear: false,
        hasRecentData: false,
        statisticsAge: []
      },
      userQuestions: [],
      contentGaps: ['Placeholder content gap']
    },
    linkProfile: {
      internalLinkCount: 0,
      externalLinkCount: 0,
      linkRatio: 0,
      orphanedContent: false,
      linkVelocity: 0,
      anchorTextDiversity: 0,
      authoritativeSources: 0
    },
    readability: {
      fleschKincaid: 0,
      gunningFog: 0,
      smog: 0,
      avgSyllablesPerWord: 0,
      passiveVoicePercentage: 0,
      transitionWords: 0,
      sentenceVariation: 0,
      jargonScore: 0
    },
    technicalSEO: {
      estimatedLoadTime: 0,
      renderBlockingElements: [],
      imageOptimization: {
        hasWebP: false,
        hasLazyLoading: false,
        hasSrcSet: false,
        totalSize: 0
      },
      coreWebVitals: {
        lcp: 0,
        fid: 0,
        cls: 0
      }
    }
  }
} 