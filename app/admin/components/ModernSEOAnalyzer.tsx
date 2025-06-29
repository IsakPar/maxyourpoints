'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Target, 
  TrendingUp, 
  Eye, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Brain,
  Users,
  Star,
  Shield,
  Search,
  Zap,
  BarChart3,
  Link,
  FileText,
  Clock
} from 'lucide-react'
import { analyzeModernSEO } from '@/lib/seo/modern-analysis-engine'

interface ModernSEOAnalyzerProps {
  content: string
  title: string
  metaDescription: string
  focusKeyword: string
  author?: any
  slug?: string
}

export function ModernSEOAnalyzer({
  content,
  title,
  metaDescription,
  focusKeyword,
  author,
  slug
}: ModernSEOAnalyzerProps) {
  const analysis = useMemo(() => {
    if (!content && !title && !focusKeyword) return null
    return analyzeModernSEO(content, title, metaDescription, focusKeyword, author)
  }, [content, title, metaDescription, focusKeyword, author])

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Modern SEO Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Start writing to see SEO analysis...</p>
        </CardContent>
      </Card>
    )
  }

  // Show placeholder message when score is 0 (placeholder implementation)
  if (analysis.score === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Modern SEO Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">SEO Engine Placeholder</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  The advanced SEO analysis engine is currently in placeholder mode. 
                  We're planning to build a dedicated SEO analysis service that will provide 
                  comprehensive scoring, competitor analysis, and optimization recommendations.
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  For now, focus on creating high-quality content with proper headings, 
                  good readability, and natural keyword usage.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>SEO Score</span>
            </div>
            <Badge variant={getScoreBadgeVariant(analysis.score)} className="text-lg px-3 py-1">
              {analysis.score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={analysis.score} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Search Intent:</span>
              <p className="font-medium capitalize">{analysis.searchIntentMatch.searchIntent}</p>
            </div>
            <div>
              <span className="text-gray-600">Topic Coverage:</span>
              <p className="font-medium">{analysis.searchIntentMatch.coverage}%</p>
            </div>
            <div>
              <span className="text-gray-600">E-E-A-T Score:</span>
              <p className="font-medium">
                {Math.round((analysis.eeatAnalysis.experienceScore + analysis.eeatAnalysis.expertiseScore + 
                           analysis.eeatAnalysis.authorityScore + analysis.eeatAnalysis.trustScore) / 4)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Intent & Topic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Search Intent & Topic Authority</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Search Intent Match</span>
            <Badge variant={analysis.searchIntentMatch.topicCompleteness > 0.7 ? 'default' : 'secondary'}>
              {analysis.searchIntentMatch.searchIntent}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Topic Completeness</span>
              <span className="text-sm font-medium">{Math.round(analysis.searchIntentMatch.topicCompleteness * 100)}%</span>
            </div>
            <Progress value={analysis.searchIntentMatch.topicCompleteness * 100} />
          </div>

          {analysis.searchIntentMatch.missingTerms.length > 0 && (
            <Alert>
              <Brain className="w-4 h-4" />
              <AlertDescription>
                <strong>Missing semantic terms:</strong> {analysis.searchIntentMatch.missingTerms.join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* E-E-A-T Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>E-E-A-T Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Experience</span>
                <span className="text-sm font-medium">{analysis.eeatAnalysis.experienceScore}%</span>
              </div>
              <Progress value={analysis.eeatAnalysis.experienceScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Expertise</span>
                <span className="text-sm font-medium">{analysis.eeatAnalysis.expertiseScore}%</span>
              </div>
              <Progress value={analysis.eeatAnalysis.expertiseScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Authority</span>
                <span className="text-sm font-medium">{analysis.eeatAnalysis.authorityScore}%</span>
              </div>
              <Progress value={analysis.eeatAnalysis.authorityScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Trust</span>
                <span className="text-sm font-medium">{analysis.eeatAnalysis.trustScore}%</span>
              </div>
              <Progress value={analysis.eeatAnalysis.trustScore} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              {analysis.eeatAnalysis.signals.firstPersonExperience ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>First-person experience</span>
            </div>
            <div className="flex items-center space-x-2">
              {analysis.eeatAnalysis.signals.citations > 0 ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>Citations ({analysis.eeatAnalysis.signals.citations})</span>
            </div>
            <div className="flex items-center space-x-2">
              {analysis.eeatAnalysis.signals.dataPoints > 0 ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>Data points ({analysis.eeatAnalysis.signals.dataPoints})</span>
            </div>
            <div className="flex items-center space-x-2">
              {analysis.eeatAnalysis.signals.hasSources ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>External sources</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Snippet Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Featured Snippet Optimization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Answer Box Potential</span>
            <Badge variant={analysis.snippetOptimization.answerBoxPotential > 70 ? 'default' : 'secondary'}>
              {analysis.snippetOptimization.answerBoxPotential}%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Snippet Format</span>
            <Badge variant="outline" className="capitalize">
              {analysis.snippetOptimization.snippetType}
            </Badge>
          </div>

          {analysis.snippetOptimization.optimizationTips.length > 0 && (
            <Alert>
              <Zap className="w-4 h-4" />
              <AlertDescription>
                <strong>Optimization tips:</strong>
                <ul className="mt-2 space-y-1">
                  {analysis.snippetOptimization.optimizationTips.map((tip, index) => (
                    <li key={index} className="text-sm">• {tip}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Content Quality & Depth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Content Quality & Depth</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Comprehensiveness</span>
              <p className="font-medium">{analysis.contentDepth.comprehensiveness}%</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Unique Insights</span>
              <p className="font-medium">{analysis.contentDepth.uniqueInsights} indicators</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              {analysis.contentDepth.freshness.hasCurrentYear ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>Current year</span>
            </div>
            <div className="flex items-center space-x-2">
              {analysis.contentDepth.freshness.hasRecentData ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>Recent data</span>
            </div>
            <div className="flex items-center space-x-2">
              {analysis.contentDepth.userQuestions.length > 0 ? 
                <CheckCircle className="w-3 h-3 text-green-500" /> : 
                <XCircle className="w-3 h-3 text-red-500" />
              }
              <span>Questions ({analysis.contentDepth.userQuestions.length})</span>
            </div>
          </div>

          {analysis.contentDepth.contentGaps.length > 0 && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Content gaps to address:</strong> {analysis.contentDepth.contentGaps.join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Link Profile Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="w-5 h-5" />
            <span>Link Profile & Authority</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Internal Links</span>
              <p className="font-medium">{analysis.linkProfile.internalLinkCount}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">External Links</span>
              <p className="font-medium">{analysis.linkProfile.externalLinkCount}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Authoritative Sources</span>
              <p className="font-medium">{analysis.linkProfile.authoritativeSources}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Anchor Diversity</span>
              <p className="font-medium">{Math.round(analysis.linkProfile.anchorTextDiversity * 100)}%</p>
            </div>
          </div>

          {analysis.linkProfile.orphanedContent && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                This content has no internal links. Consider linking to related articles for better topical authority.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Readability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Enhanced Readability Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Flesch-Kincaid Grade:</span>
              <p className="font-medium">{analysis.readability.fleschKincaid}</p>
            </div>
            <div>
              <span className="text-gray-600">Gunning Fog Index:</span>
              <p className="font-medium">{analysis.readability.gunningFog}</p>
            </div>
            <div>
              <span className="text-gray-600">Passive Voice:</span>
              <p className="font-medium">{analysis.readability.passiveVoicePercentage}%</p>
            </div>
            <div>
              <span className="text-gray-600">Transition Words:</span>
              <p className="font-medium">{analysis.readability.transitionWords}</p>
            </div>
            <div>
              <span className="text-gray-600">Sentence Variation:</span>
              <p className="font-medium">{analysis.readability.sentenceVariation}</p>
            </div>
            <div>
              <span className="text-gray-600">Jargon Score:</span>
              <p className="font-medium">{analysis.readability.jargonScore}/1000</p>
            </div>
          </div>

          {analysis.readability.passiveVoicePercentage > 20 && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                High passive voice usage ({analysis.readability.passiveVoicePercentage}%). Consider using more active voice for better engagement.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Search Engine Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Engine Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border rounded-lg p-4 max-w-2xl">
            <div className="space-y-1">
              <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                {title || 'Your Article Title'}
              </div>
              <div className="text-green-700 text-sm">
                maxyourpoints.com › blog › {slug || 'article-slug'}
              </div>
              <div className="text-gray-600 text-sm leading-snug">
                {metaDescription || 'Your meta description will appear here...'}
              </div>
            </div>
          </div>
          
          {(title.length > 60 || metaDescription.length > 160) && (
            <Alert className="mt-4">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {title.length > 60 && <div>Title is too long ({title.length}/60 characters)</div>}
                {metaDescription.length > 160 && <div>Meta description is too long ({metaDescription.length}/160 characters)</div>}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 