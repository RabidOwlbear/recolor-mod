export const registerRecolor = function () {
  rclmod.recolor = async (theme) => {
    let logoEl = document.querySelector('#logo');

    if (!theme) {
      const forceGlobal = await game.settings.get(rclmod.modName, 'forceGlobal');
      const active = forceGlobal
        ? await game.settings.get(rclmod.modName, 'globalTheme')
        : await game.settings.get(rclmod.modName, 'activeTheme');
      for (let color of active.colors) {
        document.documentElement.style.setProperty(color.tag, color.value);
      }
      for (let sbc of active.sidebar.colors) {
        document.documentElement.style.setProperty(sbc.tag, sbc.value);
      }
      let url = `url(../assets/bg/${active.sidebar.background})`;
      document.documentElement.style.setProperty('--sidebar-bg-url', url);
      document.documentElement.style.setProperty('--sidebar-color', active.sidebar.bgColor);
      logoEl.src = `modules/recolor-mod/assets/icon/${active.logo}`;
    }
    if (theme) {
      for (let color of theme.colors) {
        document.documentElement.style.setProperty(color.tag, color.value);
      }
      for (let sbc of theme.sidebar.colors) {
        document.documentElement.style.setProperty(sbc.tag, sbc.value);
      }
      console.log('bgc', theme.sidebar.bgColor);
      document.documentElement.style.setProperty('--sidebar-bg-url', `url(../assets/bg/${theme.sidebar.background})`);
      document.documentElement.style.setProperty('--sidebar-color', theme.sidebar.bgColor);
      logoEl.src = `modules/recolor-mod/assets/icon/${theme.logo}`;
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
