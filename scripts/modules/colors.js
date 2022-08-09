// export const registerColors = async function () {

//     rclmod.colors.pauseGlow = 'flicker 2.5s infinite alternate',
//     rclmod.colors.pauseGlowAlt = `0 0 40px var(--pause-color)`
// }
export const registerRecolor = function () {
  rclmod.recolor = async (theme) => {
    let recolor = await game.settings.get(rclmod.modName, 'recolor');
    if(!theme){
      if (recolor) {
        const active = await game.settings.get(rclmod.modName, 'activeTheme');
        console.log('rclmod', active)
        for (let color of active.colors) {
          console.log('color', color.value, 'tag', color.tag)
          document.documentElement.style.setProperty(color.tag, color.value);
        }
      };
    }
    if(theme){
      for (let color of theme.colors) {
        // console.log('color', color.value, 'tag', color.tag)
        document.documentElement.style.setProperty(color.tag, color.value);
      }
    }
  }

  rclmod.resetThemes = async function (){
    let defaultTheme = rclmod.themes.themeData.find(t=>t.name == "Hyaena");
    await game.settings.set(rclmod.modName, 'themes', rclmod.themes.themeData);
    await game.settings.set(rclmod.modName, 'activeTheme', defaultTheme);
    rclmod.recolor()
  }
};


