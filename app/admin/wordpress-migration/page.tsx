'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Globe, 
  Rss, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  FileText,
  Database,
  ArrowRight,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ImportResult {
  title: string
  status: 'success' | 'error'
  id?: number
  error?: string
}

export default function WordPressMigrationPage() {
  const [importSource, setImportSource] = useState<'json' | 'url' | 'rss'>('url')
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<ImportResult[] | null>(null)
  const [importStats, setImportStats] = useState<{total: number, successful: number, errors: number} | null>(null)
  
  // Form data
  const [wordpressUrl, setWordpressUrl] = useState('')
  const [rssUrl, setRssUrl] = useState('')
  const [jsonData, setJsonData] = useState('')

  const handleImport = async () => {
    setIsImporting(true)
    setImportResults(null)
    setImportStats(null)

    try {
      let requestBody: any = { source: importSource }

      switch (importSource) {
        case 'json':
          if (!jsonData.trim()) {
            toast.error('Please provide JSON data')
            return
          }
          try {
            requestBody.data = JSON.parse(jsonData)
          } catch (error) {
            toast.error('Invalid JSON format')
            return
          }
          break
          
        case 'url':
          if (!wordpressUrl.trim()) {
            toast.error('Please provide WordPress URL')
            return
          }
          requestBody.url = wordpressUrl
          break
          
        case 'rss':
          if (!rssUrl.trim()) {
            toast.error('Please provide RSS URL')
            return
          }
          requestBody.rssUrl = rssUrl
          break
      }

      const response = await fetch('/api/admin/wordpress-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      setImportResults(result.results)
      setImportStats(result.stats)
      toast.success(result.message)

    } catch (error) {
      console.error('Import error:', error)
      toast.error(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  const successCount = importResults?.filter(r => r.status === 'success').length || 0
  const errorCount = importResults?.filter(r => r.status === 'error').length || 0

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WordPress Migration</h1>
          <p className="text-gray-600 mt-2">
            Import your WordPress content to Max Your Points CMS
          </p>
        </div>
      </div>

      {/* Import Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Import Configuration
          </CardTitle>
          <CardDescription>
            Choose your import source and configure the migration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={importSource} onValueChange={(value) => setImportSource(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                WordPress URL
              </TabsTrigger>
              <TabsTrigger value="rss" className="flex items-center gap-2">
                <Rss className="w-4 h-4" />
                RSS Feed
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                JSON Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="wordpress-url">WordPress Site URL</Label>
                <Input
                  id="wordpress-url"
                  placeholder="https://your-wordpress-site.com"
                  value={wordpressUrl}
                  onChange={(e) => setWordpressUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll fetch posts from the WordPress REST API
                </p>
              </div>
            </TabsContent>

            <TabsContent value="rss" className="space-y-4">
              <div>
                <Label htmlFor="rss-url">RSS Feed URL</Label>
                <Input
                  id="rss-url"
                  placeholder="https://your-site.com/feed/"
                  value={rssUrl}
                  onChange={(e) => setRssUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Import from RSS/XML feed
                </p>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div>
                <Label htmlFor="json-data">WordPress Export JSON</Label>
                <Textarea
                  id="json-data"
                  placeholder="Paste your WordPress posts JSON data here..."
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Paste the JSON array of WordPress posts
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Import Notes:</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>All imported articles will be saved as <strong>drafts</strong></li>
                <li>Content will be cleaned and converted to markdown format</li>
                <li>Images and links will be preserved where possible</li>
                <li>You can review and edit each article before publishing</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleImport}
            disabled={isImporting}
            className="w-full"
            size="lg"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Importing...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Import
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Import Results
            </CardTitle>
            <CardDescription>
              {importStats && (
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="text-green-600">
                    ✅ {importStats.successful} successful
                  </Badge>
                  {importStats.errors > 0 && (
                    <Badge variant="outline" className="text-red-600">
                      ❌ {importStats.errors} errors
                    </Badge>
                  )}
                  <Badge variant="outline">
                    📊 {importStats.total} total
                  </Badge>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {importResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{result.title}</p>
                      {result.error && (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>
                  {result.status === 'success' && (
                    <Badge variant="outline">
                      Draft #{result.id}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {successCount > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">
                  🎉 Import completed! {successCount} articles imported as drafts.
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Visit the <a href="/admin/articles" className="underline">Articles page</a> to review and publish your imported content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 