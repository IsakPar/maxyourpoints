import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { tabs } from "sanity-plugin-tabs"
import { structure } from './structure'
import { schemaTypes } from './schemas'

import Logo from './components/Logo'
import Navbar from './components/Navbar'
import DashboardPanel from './components/DashboardPanel'

export default defineConfig({
  name: "maxyourpoints-studio",
  title: "Max Your Points Studio",
  projectId: "7b8t1ebo",
  dataset: "production",
  plugins: [
    deskTool({ structure }),
    visionTool(),
    tabs(),
    {
      name: 'custom-dashboard',
      component: DashboardPanel,
    }
  ],
  studio: {
    components: {
      logo: Logo,
      navbar: Navbar
    }
  },
  schema: {
    types: schemaTypes
  }
}) 