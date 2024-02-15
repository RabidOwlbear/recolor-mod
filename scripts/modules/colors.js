export const registerRecolor = function () {
  rclmod.recolor = async (theme) => {
    let recolor = await game.settings.get(rclmod.modName, 'recolor');
    let logoEl = document.querySelector('#logo');
    if (recolor) {
      if (!theme) {
        const active = await game.settings.get(rclmod.modName, 'activeTheme');
        for (let color of active.colors) {
          document.documentElement.style.setProperty(color.tag, color.value);
        }
        for (let sbc of active.sidebar.colors) {
          document.documentElement.style.setProperty(sbc.tag, sbc.value);
        }
        let url = `url(../assets/bg/${active.sidebar.background})`;
        document.documentElement.style.setProperty('--sidebar-bg-url', url);
        logoEl.src = `modules/recolor-mod/assets/icon/${active.logo}`;
      }
      if (theme) {
        for (let color of theme.colors) {
          document.documentElement.style.setProperty(color.tag, color.value);
        }
        for (let sbc of theme.sidebar.colors) {
          document.documentElement.style.setProperty(sbc.tag, sbc.value);
        }
        document.documentElement.style.setProperty('--sidebar-bg-url', `url(../assets/bg/${theme.sidebar.background})`);
        logoEl.src = `modules/recolor-mod/assets/icon/${theme.logo}`;
      }
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
