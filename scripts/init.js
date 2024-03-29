import { registerRecolor } from './modules/color-util.js';
import { registerLayers, releaseLayer, recolorControls } from './modules/layer.js';
import { registerSettings, registerThemes } from './modules/settings.js';
import { registerColorForm } from './modules/color-form.js';
import { defaultThemes } from './modules/themeData.js';

// namespace
window.rclmod = window.rclmod || {
  modName: 'recolor-mod',
  themes: {
    default: ['Hyaena', 'FVTT Default'],
    themeData: defaultThemes
  },
  colors: {}
};

Hooks.on('init', async () => {
  const defaultTheme = rclmod.themes.themeData.find((t) => t.name == 'Hyaena');

  await registerSettings();
  await registerThemes(defaultThemes, defaultTheme);
  registerRecolor();
  await registerColorForm();
  registerLayers();
  releaseLayer();
});
Hooks.on('ready', async () => {
  rclmod.recolor();
  rclmod.resizeSceneDisplay();
});

Hooks.on('getSceneControlButtons', recolorControls);
