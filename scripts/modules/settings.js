// import {themes} from "./modules/themes.js"

export const registerSettings = async function () {

  await game.settings.register(rclmod.modName, 'recolor', {
    name: 'Recolor',
    hint: 'Recolor Foundry',
    scope: 'client',
    type: Boolean,
    default: true,
    config: true,
    requiresReload: true,
    onChange: async () => {
      window.location.reload()
    }
  });

  
  
};
export const registerThemes = async (themes, activeTheme)=>{
  await game.settings.register(rclmod.modName, 'themes', {
    name: 'recolor-themes',
    scope:'client',
    type: Array,
    default: themes,
    config: false,
  })

  await game.settings.register(rclmod.modName, 'activeTheme', {
    name: 'active-theme',
    scope:'client',
    type: Object,
    default: activeTheme,
    config: false,
  })
    
}