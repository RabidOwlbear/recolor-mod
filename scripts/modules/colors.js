export const registerRecolor = function () {
  rclmod.recolor = async (theme) => {
    let recolor = await game.settings.get(rclmod.modName, 'recolor');
    if(!theme){
      if (recolor) {
        const active = await game.settings.get(rclmod.modName, 'activeTheme');
        
        for (let color of active.colors) {
         
          document.documentElement.style.setProperty(color.tag, color.value);
        }
      };
    }
    if(theme){
      for (let color of theme.colors) {
        
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


