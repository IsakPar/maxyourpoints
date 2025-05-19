import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import deskStructure from './components/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'MaxYourPoints',

  projectId: '7b8t1ebo',
  dataset: 'production',

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
