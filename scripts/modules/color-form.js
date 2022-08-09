export const registerColorForm = async function () {
  rclmod.ColorSettings = class ColorSettings extends FormApplication {
    constructor() {
      super();
      this.preview = false;
      this.sub = false;
    }
    static get defaultOptions() {
      const options = super.defaultOptions;
      options.baseApplication = 'colorSettings';
      options.id = 'colorSettings';
      options.template = `modules/recolor-mod/templates/color-settings.html`;
      options.height = 700;
      options.width = 700;
      return options;
    }
    async getData() {
      let active = await game.settings.get(rclmod.modName, 'activeTheme');
      let themes = await game.settings.get(rclmod.modName, 'themes');
      // console.log('active',active.colors, Object.keys(themes));
      const keys = Object.keys(themes);
      return {
        activeName: active.name,
        colors: active.colors,
        theme: themes
        // themedata: themes
      };
    }

    parseThemeColors(data) {
      let colors = [];
      let filtered = ['theme-select', 'themeName'];
      for (let key in data) {
        // console.log(key)
        if (!filtered.includes(key)) {
          if (key[0] == '-' && key[1] == '-') {
            // console.log(key.slice(2).replaceAll('-', ' '))
            colors.push({
              label: key.slice(2).replaceAll('-', ' '),
              tag: key,
              value: data[key]
            });
          } else if (key.includes('-')) {
            // console.log(key.replaceAll('-', ' '))
            colors.push({
              label: key.replaceAll('-', ' '),
              tag: key,
              value: data[key]
            });
          }
        }
      }
      // console.log(colors)
      let name = data.themeName;
      return {
        name,
        colors
      };
    }
    validateFormData(html) {
      const inputs = html.find('.form-data');
      let retObj = {};
      for (let i of inputs) {
        // console.log(i.name, i.value)
        retObj[i.name] = i.value;
      }
      return retObj;
    }
    async saveTheme(html) {
      const formData = this.validateFormData(html);
      const name = formData.themeName;
      let savedThemes = await game.settings.get(rclmod.modName, 'themes');
      let themeNames = savedThemes.map((t) => {
        console.log(t);
        return t.name;
      });
      console.log(name, themeNames, themeNames.includes(name));
      if (themeNames.includes(name)) {
        ui.notifications.warn('Name Already Exists. Choose Another.');
        return;
      }
      savedThemes.push(this.parseThemeColors(formData));
      await game.settings.set(rclmod.modName, 'themes', savedThemes);
    }
    async deleteTheme(html) {
      const savedThemes = await game.settings.get(rclmod.modName, 'themes');
      const formData = this.validateFormData(html);
      const name = formData.themeName;
      if (rclmod.themes.default.includes(name)) {
        ui.notifications.warn('Cannot Delete Default Themes');
        return;
      }
      let updatedThemes = savedThemes.filter((i) => i.name != name);
      await game.settings.set(rclmod.modName, 'themes', updatedThemes);
      console.log(updatedThemes);
    }

    activateListeners(html) {
      // select

      document.querySelector('#colorSettings .header-button.close').addEventListener('click', () => {
        console.log('closed', this, this.preview);
        if (this.preview) {
          rclmod.recolor();
        }
      });
      const inputs = html.find('.form-data');
      for (let i of inputs) {
        i.addEventListener('change', () => {
          this.preview = true;
          let theme = this.parseThemeColors(this.validateFormData(html));
          rclmod.recolor(theme);
        });
      }
      html.find('#theme-select')[0].addEventListener('change', async (ev) => {
        ev.preventDefault();
        let themeName = html.find('#theme-select')[0].value;
        let savedThemes = await game.settings.get(rclmod.modName, 'themes');
        let theme = savedThemes.find((t) => t.name == themeName);

        // await game.settings.set(rclmod.modName, 'activeTheme', theme)
        rclmod.recolor(theme);
        console.log('theme', theme);
        this.preview = true;
        if (theme?.colors) {
          for (let color of theme.colors) {
            console.log(color);
            let input = await html.find(`#${color.tag}`)[0];
            input.value = color.value;
          }
        }
        html.find('#theme-name')[0].value = themeName;
      });

      html.find('#save-theme-btn')[0].addEventListener('click', async (ev) => {
        ev.preventDefault();
        // const nameInp = await html.find('#theme-name')[0]
        // console.log(nameInp)
        rclmod.recolor(this.parseThemeColors(this.validateFormData(html)));
        await this.saveTheme(html);

        this.render(true);
      });

      html.find('#delete-theme-btn')[0].addEventListener('click', async (ev) => {
        ev.preventDefault();
        await this.deleteTheme(html);
        this.render(true);
      });
      html.find('#xport-btn')[0].addEventListener('click', async (ev) => {
        ev.preventDefault();
        let themes = await game.settings.get(rclmod.modName, `themes`);
        let jsonObj = {
          name: `${rclmod.modName} themes`,
          themeData: themes
        };
        let data = JSON.stringify(jsonObj);
        let xport = 'data:export/plain;charset=utf-8, ' + encodeURIComponent(data);
        let filename = 'saved-themes.json';
        let alink = document.createElement('a');
        alink.href = xport;
        alink.setAttribute('download', filename);
        alink.click();
      });
      html.find('#import-btn')[0].addEventListener('click', async (ev) => {
        ev.preventDefault();
        const input = document.createElement('input');
        const form = this;
        input.type = 'file';
        input.addEventListener('change', async function (e) {
          let file = this.files[0];
          if (file.type != 'application/json') {
            ui.notifications.warn('Please select a valid JSON file.');
            return;
          }
          let fr = new FileReader();
          fr.onload = async function (e) {
            let content = e.target.result;
            let parsed = JSON.parse(content);
            console.log(parsed);
            let validated = parsed.name == `${rclmod.modName} themes`;
            if (!validated) {
              ui.notifications.warn('Please select a theme file.');
              return;
            }
            if (validated) {
              await game.settings.set(rclmod.modName, 'themes', parsed.themeData);
              form.render();
              return 'settings updated';
            }
          };
          fr.readAsText(file);
        });
        input.click();
      });
    }
    async _onSubmit(event) {
      super._onSubmit(event, { preventRefresh: true });
    }

    async _updateObject(ev, formdata) {
      console.log(this.sub);
      ev.preventDefault();
      // console.log(ev, formdata);

      const curTheme = this.parseThemeColors(formdata);
      rclmod.recolor(curTheme);
      // console.log(curTheme)
      await game.settings.set(rclmod.modName, 'activeTheme', curTheme);
    }
  };
  await game.settings.registerMenu(`recolor-mod`, 'colorSettings', {
    name: 'Edit Colors',
    label: 'Edit Colors',
    icon: 'fas fa-wrench',
    scope: 'world',
    type: rclmod.ColorSettings,
    config: true,
    restricted: true
  });
};
