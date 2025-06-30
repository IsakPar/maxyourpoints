'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  FileText, 
  FileJson, 
  Table,
  Filter,
  Loader2,
  CheckCircle,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface ExportMenuProps {
  dataType: 'errors' | 'performance' | 'analytics' | 'articles'
  period: string
  onExport?: (type: string, format: string, filters: any) => void
}

interface ExportFilters {
  severity?: string
  errorType?: string
  resolved?: boolean
  pagePath?: string
  dateRange?: string
}

export function ExportMenu({ dataType, period, onExport }: ExportMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('')
  const [filters, setFilters] = useState<ExportFilters>({})
  const [isExporting, setIsExporting] = useState(false)
  const [customDateRange, setCustomDateRange] = useState('')

  const exportFormats = [
    { 
      id: 'csv', 
      name: 'CSV File', 
      icon: Table, 
      description: 'Comma-separated values for spreadsheets',
      color: 'text-green-600'
    },
    { 
      id: 'json', 
      name: 'JSON File', 
      icon: FileJson, 
      description: 'Machine-readable data format',
      color: 'text-blue-600'
    },
    { 
      id: 'pdf', 
      name: 'PDF Report', 
      icon: FileText, 
      description: 'Professional report document',
      color: 'text-red-600'
    }
  ]

  const handleQuickExport = async (format: string) => {
    setIsExporting(true)
    toast.loading(`Preparing ${format.toUpperCase()} export...`)
    try {
      await performExport(format, {})
      toast.success(`📁 ${format.toUpperCase()} export completed successfully!`, {
        description: `Your ${getDataTypeLabel()} data has been downloaded`
      })
    } catch (error) {
      console.error('Export failed:', error)
      toast.error(`❌ Export failed`, {
        description: 'Please try again or contact support if the issue persists'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleAdvancedExport = async () => {
    if (!selectedFormat) {
      toast.error('Please select an export format')
      return
    }

    setIsExporting(true)
    toast.loading(`Preparing advanced ${selectedFormat.toUpperCase()} export...`)
    try {
      await performExport(selectedFormat, filters)
      toast.success(`🎯 Advanced ${selectedFormat.toUpperCase()} export completed!`, {
        description: `Filtered ${getDataTypeLabel()} data exported successfully`
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      toast.error(`❌ Advanced export failed`, {
        description: 'Please check your filters and try again'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const performExport = async (format: string, exportFilters: ExportFilters) => {
    const response = await fetch('/api/admin/analytics/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: dataType,
        format,
        period: customDateRange || period,
        filters: exportFilters
      })
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    if (format === 'pdf') {
      const data = await response.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      downloadFile(blob, `${dataType}-report.json`)
      toast.info('📋 PDF generation coming soon!', {
        description: 'Downloaded structured JSON data instead'
      })
    } else {
      const blob = await response.blob()
      downloadFile(blob, `${dataType}-export.${format}`)
    }

    onExport?.(dataType, format, exportFilters)
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'errors': return 'Error Analytics'
      case 'performance': return 'Performance Data'
      case 'analytics': return 'Website Analytics'
      case 'articles': return 'Article Analytics'
      default: return 'Analytics Data'
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Quick Export
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {exportFormats.map((format) => {
            const Icon = format.icon
            return (
              <DropdownMenuItem 
                key={format.id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleQuickExport(format.id)}
                disabled={isExporting}
              >
                <Icon className={`h-4 w-4 ${format.color}`} />
                <span>{format.name}</span>
                {isExporting && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
              </DropdownMenuItem>
            )
          })}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <Settings className="h-4 w-4 text-purple-600" />
            Advanced Export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Advanced Export
            </DialogTitle>
            <DialogDescription>
              Configure export settings for {getDataTypeLabel()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Format</Label>
              <div className="grid grid-cols-1 gap-2">
                {exportFormats.map((format) => {
                  const Icon = format.icon
                  return (
                    <div
                      key={format.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormat === format.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${format.color}`} />
                        <div className="flex-1">
                          <div className="font-medium">{format.name}</div>
                          <div className="text-sm text-gray-500">{format.description}</div>
                        </div>
                        {selectedFormat === format.id && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={customDateRange || period} onValueChange={setCustomDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error-specific filters */}
            {dataType === 'errors' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select value={filters.severity || ''} onValueChange={(value) => 
                    setFilters({...filters, severity: value || undefined})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errorType">Error Type</Label>
                  <Select value={filters.errorType || ''} onValueChange={(value) => 
                    setFilters({...filters, errorType: value || undefined})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="All error types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JavaScript Error">JavaScript Error</SelectItem>
                      <SelectItem value="Network Error">Network Error</SelectItem>
                      <SelectItem value="Server Error">Server Error</SelectItem>
                      <SelectItem value="Validation Error">Validation Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pagePath">Page Path Filter</Label>
                  <Input
                    id="pagePath"
                    placeholder="e.g., /blog/article-name"
                    value={filters.pagePath || ''}
                    onChange={(e) => setFilters({...filters, pagePath: e.target.value || undefined})}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="resolved"
                    checked={filters.resolved === true}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, resolved: checked ? true : undefined})
                    }
                  />
                  <Label htmlFor="resolved">Only resolved errors</Label>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {Object.keys(filters).filter(key => filters[key as keyof ExportFilters]).length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Active Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null
                    return (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdvancedExport}
              disabled={!selectedFormat || isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export {selectedFormat?.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 