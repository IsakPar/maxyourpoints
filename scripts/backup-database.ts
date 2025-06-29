import { supabaseAdmin } from '../lib/supabase/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

interface BackupResult {
  table: string
  records: number
  success: boolean
  error?: string
}

const BACKUP_TABLES = [
  'articles',
  'categories', 
  'users',
  'media',
  'newsletter_subscribers'
] as const

async function backupTable(tableName: string): Promise<BackupResult> {
  try {
    console.log(`📦 Backing up table: ${tableName}`)
    
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`❌ Error backing up ${tableName}:`, error)
      return {
        table: tableName,
        records: 0,
        success: false,
        error: error.message
      }
    }

    console.log(`✅ ${tableName}: ${data?.length || 0} records`)
    
    return {
      table: tableName,
      records: data?.length || 0,
      success: true,
      data: data || []
    }

  } catch (error: any) {
    console.error(`❌ Exception backing up ${tableName}:`, error)
    return {
      table: tableName,
      records: 0,
      success: false,
      error: error.message
    }
  }
}

async function createDatabaseBackup(): Promise<void> {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
  const backupDir = join(process.cwd(), 'backups')
  const backupFile = join(backupDir, `backup-${timestamp}.json`)
  
  console.log('🚀 Starting database backup...')
  console.log(`📁 Backup directory: ${backupDir}`)
  console.log(`📄 Backup file: backup-${timestamp}.json`)

  // Create backup directory if it doesn't exist
  try {
    mkdirSync(backupDir, { recursive: true })
  } catch (error) {
    console.log('📁 Backup directory already exists or created')
  }

  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0',
    database: 'maxyourpoints-cms',
    tables: {} as Record<string, any>,
    summary: {
      totalTables: 0,
      totalRecords: 0,
      successfulTables: 0,
      failedTables: 0,
      errors: [] as string[]
    }
  }

  // Backup each table
  for (const tableName of BACKUP_TABLES) {
    const result = await backupTable(tableName)
    
    backup.summary.totalTables++
    
    if (result.success) {
      backup.tables[tableName] = (result as any).data
      backup.summary.totalRecords += result.records
      backup.summary.successfulTables++
    } else {
      backup.summary.failedTables++
      if (result.error) {
        backup.summary.errors.push(`${tableName}: ${result.error}`)
      }
    }
  }

  // Add metadata
  backup.tables._metadata = {
    backupDate: backup.timestamp,
    tablesIncluded: BACKUP_TABLES,
    totalRecords: backup.summary.totalRecords,
    backupSize: JSON.stringify(backup.tables).length
  }

  // Write backup file
  try {
    writeFileSync(backupFile, JSON.stringify(backup, null, 2))
    console.log(`✅ Backup completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`   📦 Tables: ${backup.summary.successfulTables}/${backup.summary.totalTables}`)
    console.log(`   📄 Records: ${backup.summary.totalRecords.toLocaleString()}`)
    console.log(`   💾 File size: ${(JSON.stringify(backup).length / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   📍 Location: ${backupFile}`)
    
    if (backup.summary.errors.length > 0) {
      console.log(`⚠️ Errors:`)
      backup.summary.errors.forEach(error => console.log(`   - ${error}`))
    }
    
  } catch (error: any) {
    console.error('❌ Failed to write backup file:', error)
    throw error
  }
}

// Add backup verification
async function verifyBackup(backupFile: string): Promise<boolean> {
  try {
    console.log('🔍 Verifying backup...')
    const fs = require('fs')
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'))
    
    // Basic validation
    const requiredFields = ['timestamp', 'version', 'database', 'tables', 'summary']
    for (const field of requiredFields) {
      if (!(field in backup)) {
        console.error(`❌ Missing field: ${field}`)
        return false
      }
    }
    
    // Validate each table
    for (const tableName of BACKUP_TABLES) {
      if (!(tableName in backup.tables)) {
        console.error(`❌ Missing table: ${tableName}`)
        return false
      }
      
      if (!Array.isArray(backup.tables[tableName])) {
        console.error(`❌ Table ${tableName} is not an array`)
        return false
      }
    }
    
    console.log('✅ Backup verification passed')
    return true
    
  } catch (error: any) {
    console.error('❌ Backup verification failed:', error)
    return false
  }
}

// Main execution
async function main() {
  try {
    await createDatabaseBackup()
    
    // Add option to verify backup
    if (process.argv.includes('--verify')) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
      const backupFile = join(process.cwd(), 'backups', `backup-${timestamp}.json`)
      await verifyBackup(backupFile)
    }
    
  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  }
}

// Handle CLI execution
if (require.main === module) {
  main()
}

export { createDatabaseBackup, verifyBackup } 