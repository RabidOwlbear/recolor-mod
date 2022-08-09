import { registerRecolor} from "./modules/colors.js"
// import {} from "./modules/colors.js"
import {registerSettings, registerThemes} from "./modules/settings.js"
import {registerColorForm} from "./modules/color-form.js"
import {defaultThemes} from "./modules/themeData.js"

// namespace
  window.rclmod = window.rclmod || {
    modName: 'recolor-mod',
    themes: {
      default: ['Hyaena', 'FVTT Default'],
      themeData: defaultThemes
    },
    colors: {},
  }

  Hooks.on('init', async ()=>{
    const defaultTheme = rclmod.themes.themeData.find(t=>t.name == 'Hyaena');
    // rclmod.colorize = colorize
    await registerSettings()
    await registerThemes(defaultThemes, defaultTheme)
    
    registerRecolor()
    await registerColorForm()
  })
  Hooks.on('ready', async ()=>{
    

    rclmod.recolor()
    
  })

  