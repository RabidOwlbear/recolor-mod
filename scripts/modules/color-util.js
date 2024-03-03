export const registerRecolor = function () {
  rclmod.recolor = async (theme) => {
    let logoEl = document.querySelector('#logo');
    const forceGlobalTheme = await game.settings.get(rclmod.modName, 'forceGlobalTheme');
    const forceGlobalLogo = await game.settings.get(rclmod.modName, 'forceGlobalLogo');
    let logoPath
    if (!theme) {
      const customLogo = await game.settings.get(rclmod.modName, 'customLogo');
      const active = forceGlobalTheme
        ? await game.settings.get(rclmod.modName, 'globalTheme')
        : await game.settings.get(rclmod.modName, 'activeTheme');
      for (let color of active.colors) {
        document.documentElement.style.setProperty(color.tag, color.value);
      }
      for (let sbc of active.sidebar.colors) {
        document.documentElement.style.setProperty(sbc.tag, sbc.value);
      }
      let url = `url(../assets/bg/${active.sidebar.background})`;
      logoPath = forceGlobalLogo ? customLogo: `modules/recolor-mod/assets/icon/${active.logo}`

      document.documentElement.style.setProperty('--sidebar-bg-url', url);
      document.documentElement.style.setProperty('--sidebar-color', active.sidebar.bgColor);
      logoEl.src = logoPath;
    }
    if (theme) {
      logoPath = forceGlobalLogo ? customLogo: `modules/recolor-mod/assets/icon/${theme.logo}`
      for (let color of theme.colors) {
        document.documentElement.style.setProperty(color.tag, color.value);
      }
      for (let sbc of theme.sidebar.colors) {
        document.documentElement.style.setProperty(sbc.tag, sbc.value);
      }
      document.documentElement.style.setProperty('--sidebar-bg-url', `url(../assets/bg/${theme.sidebar.background})`);
      document.documentElement.style.setProperty('--sidebar-color', theme.sidebar.bgColor);
      logoEl.src = logoPath;
    }
  };

  rclmod.resetThemes = async function () {
    let defaultTheme = rclmod.themes.themeData.find((t) => t.default);
    await game.settings.set(rclmod.modName, 'themes', rclmod.themes.themeData);
    await game.settings.set(rclmod.modName, 'activeTheme', defaultTheme);
    rclmod.recolor();
  };
  rclmod.resizeSceneDisplay = async function () {
    let shrink = await game.settings.get(rclmod.modName, 'shrinkScene');
    const size = shrink ? '50px' : '100px';
    document.documentElement.style.setProperty('--scene-display-height', size);
  };
};
async function pauseToggle() {
  const text = document.querySelector('#pause figcaption');
  const forceGlobalTheme = await game.settings.get('recolor-mod', 'forceGlobalTheme');
  const setting = forceGlobalTheme ? 'globalTheme' : 'activeTheme';
  const disableGlow = false; //await game.settings.get('recolor-mod', 'disableGlow');
  const theme = await game.settings.get('recolor-mod', setting);

  console.log('theme', setting, theme);
  if (disableGlow) {
    document.documentElement.style.setProperty('--pause-color', theme.pause.fontColor);
    document.documentElement.style.setProperty('--pause-anim', '');
    document.documentElement.style.setProperty('--pause-glow', 'var(--pause-glow-alt)');
  } else {
    // document.documentElement.style.setProperty('--pause-color', theme.pause.fontColor);
    // document.documentElement.style.setProperty('--pause-anim', theme.pause.animation);
    // document.documentElement.style.setProperty('--pause-glow', 'none');
    text.style
  }
}