// import {themes} from "./modules/themes.js"

export const registerSettings = async function () {
  await game.settings.register(rclmod.modName, 'forceGlobalTheme', {
    name: 'Use Global Theme',
    hint: 'Use a single theme for all connected clients. Enabling this setting will disable custom themes for players.',
    scope: 'world',
    type: Boolean,
    default: false,
    config: true,
    requiresReload: true,
    onChange: async () => {
      window.location.reload();
    }
  });
  await game.settings.register(rclmod.modName, 'forceGlobalLogo', {
    name: 'Use Global Logo',
    hint: 'Use a single Logo for all connected clients. Enabling this setting will disable custom Logos for players.',
    scope: 'world',
    type: Boolean,
    default: false,
    config: true,
    requiresReload: true,
    onChange: async () => {
      window.location.reload();
    }
  });
  await game.settings.register(rclmod.modName, 'customLogo', {
    name: 'Custom Logo File',
    hint: "Choose a custom logo file to use. Ideal image size is 100px x 50px.",
    scope: 'world',
    type: String,
    config: true,
    filePicker: 'image',
    onChange: async () => {
      const  logoEl = document.querySelector('#logo');
      logoEl.src = await game.settings.get(rclmod.modName, 'customLogo');
    }
  });

  await game.settings.register(rclmod.modName, 'shrinkScene', {
    name: 'Shrink Scene Display',
    hint: 'Reduces the display height of scenes on the sidebar.',
    scope: 'client',
    type: Boolean,
    default: true,
    config: true,
    requiresReload: true,
    onChange: async () => {
      window.location.reload();
    }
  });
};
export const registerThemes = async (themes, activeTheme) => {
  await game.settings.register(rclmod.modName, 'themes', {
    name: 'recolor-themes',
    scope: 'client',
    type: Array,
    default: themes,
    config: false
  });

  await game.settings.register(rclmod.modName, 'activeTheme', {
    name: 'active-theme',
    scope: 'client',
    type: Object,
    default: activeTheme,
    config: false
  });
  await game.settings.register(rclmod.modName, 'globalTheme', {
    name: 'active-theme',
    scope: 'world',
    type: Object,
    default: activeTheme,
    config: false
  });
};
