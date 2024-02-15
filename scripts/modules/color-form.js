const sidebarBackgrounds = [
  { img: 'denim.png', label: 'Denim' },
  { img: 'denim075.png', label: 'Denim Small' },
  { img: 'sidebar-04.png', label: 'Owlbear Wave 01' },
  { img: 'sidebar-07.png', label: 'Owlbear Wave 02' },
  { img: 'sidebar-09.png', label: 'Owlbear Wave 03' },
  { img: 'sidebar-11.png', label: 'Owlbear Wave 04' },
  { img: 'sidebar-05.png', label: 'Owlbear 01' },
  { img: 'sidebar-06.png', label: 'Owlbear 02' },
  { img: 'sidebar-10.png', label: 'Owlbear 03' },
  { img: 'sidebar-08.png', label: 'Wave 01' },
  { img: 'sidebar-18.png', label: 'Wave 02' },
  { img: 'sidebar-13.png', label: 'Brick 01' },
  { img: 'sidebar-14.png', label: 'Brick 02' },
  { img: 'sidebar-15.png', label: 'Hex 01' },
  { img: 'sidebar-16.png', label: 'Chevron 01' },
  { img: 'sidebar-17.png', label: 'Chevron 02' },
  { img: 'sidebar-19.png', label: 'Circles 01' }
];
const logoOptions = [
  { value: 'fvtt.png', label: 'Default' },
  { value: 'ico-1.webp', label: 'Angry' },
  { value: 'ico-2.webp', label: 'Gothic' },
  { value: 'ico-3.webp', label: 'SciFi 01' },
  { value: 'ico-13.webp', label: 'SciFi 02' },
  { value: 'ico-14.webp', label: 'SciFi 03' },
  { value: 'ico-4.webp', label: 'Tattoo 01' },
  { value: 'ico-7.webp', label: 'Tattoo 02' },
  { value: 'ico-8.webp', label: 'Tattoo 03' },
  { value: 'ico-9.webp', label: 'Tattoo 04' },
  { value: 'ico-10.webp', label: "Tattoo 05" },
  { value: 'ico-11.webp', label: "Tattoo 06" },
  { value: 'ico-12.webp', label: "Tattoo 07" },
  { value: 'ico-5.webp', label: "80's 01" },
  { value: 'ico-6.webp', label: "80's 02" }
];

export const registerColorForm = async function () {
  rclmod.ColorSettings = class ColorSettings extends FormApplication {
    constructor() {
      super();
      this.preview = false;
      this.sub = false;
      this.changed = false;
      this.activeTheme = null;
      this.sidebarBackgrounds = sidebarBackgrounds;
      this.logoOptions = logoOptions;
    }
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        title: 'Theme Editor',
        classes: ['recolor-mod', 'colorSettings'],
        baseApplication: 'colorSettings',
        id: 'colorSettings',
        template: 'modules/recolor-mod/templates/recolor-settings.hbs',
        tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.tab-content', initial: 'sidebar' }],
        height: 760,
        width: 700
      });
    }
    async getData() {
      let active = deepClone(await game.settings.get(rclmod.modName, 'activeTheme'));
      this.activeTheme = active;
      let themes = deepClone(await game.settings.get(rclmod.modName, 'themes'));
      active.colors = this._prepareColorData(active.colors);
      active.sidebar.colors = this._prepareColorData(active.sidebar.colors);
      const context = {
        activeName: active.name,
        colors: active.colors,
        sidebarColors: active.sidebar.colors,
        sidebarBgColor: this._prepareColorData([{ value: active.sidebar.bgColor }])[0],
        sidebarBgImg: active.sidebar.background,
        sidebarBackgrounds: this._prepareBgImgData(active),
        logoOptions: this.logoOptions,
        logo: active.logo,
        themes: themes
      };
      return context;
    }

    activateListeners(html) {
      this._updateSidebarPreview(html);
      this._updateLogoPreview(this.activeTheme.logo);
      // select
      const themeSelect = html.find('#theme-select')[0];
      const applyBtn = html.find('#apply-theme')[0];
      const saveTheme = html.find('#save-theme')[0];
      const sbBgSelect = html.find('#sidebar-bg-select')[0];
      const bgSelect = html.find('#sidebar-bg-select')[0];
      const colorCells = [...html.find('.color-cell')];
      const sidebarColors = html.find('.sidebar-content .color-cell');
      const themeNameInp = html.find('#theme-name')[0];
      const delThemeBtn = html.find('.delete-theme-btn')[0];
      const logoSelect = html.find('#logo-select')[0];
      logoSelect.value = this.activeTheme.logo;
      const logoPreview = html.find('.logo-preview .image')[0];
      logoSelect.addEventListener('change', (e) => {
        this._updateLogoPreview(logoSelect.value);
        this._showSaveInput(html);
      });
      document.querySelector('#colorSettings .header-button.close').addEventListener('click', () => {
        if (this.preview) {
          rclmod.recolor();
        }
      });
      for (let cell of colorCells) {
        const hiddenPicker = cell.querySelector('.hiddenpicker');
        const colorClicker = cell.querySelector('.colorclicker');
        const opacityInput = cell.querySelector('.opacity-inp');
        opacityInput.addEventListener('change', (e) => {
          e.preventDefault();
          this._showSaveInput(html);
        });
        hiddenPicker.addEventListener('change', (e) => {
          e.preventDefault();
          colorClicker.style.backgroundColor = hiddenPicker.value;
          cell.dataset.color = hiddenPicker.value;
          hiddenPicker.dataset.opacity = 1;
          this._showSaveInput(html);
        });
        colorClicker.addEventListener('click', (e) => {
          e.preventDefault();
          hiddenPicker.click();
        });
        colorClicker.addEventListener('contextmenu', this._handleOpacityInput.bind(this));
      }
      bgSelect.addEventListener('change', (e) => {
        e.preventDefault();
        this._showSaveInput(html);
      });
      themeSelect.addEventListener(
        'change',
        function (e) {
          e.preventDefault();
          themeNameInp.value = themeSelect.value;
          this._updateThemeDisplay(themeSelect.value, html);
        }.bind(this)
      );
      applyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cells = [...html.find('.color-cell')];
        this._applyTheme(themeSelect.value);
      });

      for (let sbc of sidebarColors) {
        let input = sbc.querySelector('.opacity-inp');
        input.addEventListener(
          'change',
          function (e) {
            this._updateCellColor(e);
            this._updateSidebarPreview(html);
          }.bind(this)
        );
        sbc.addEventListener(
          'change',
          function (e) {
            this._updateSidebarPreview(html);
          }.bind(this)
        );
      }
      sbBgSelect.addEventListener(
        'change',
        function (e) {
          this._updateSidebarPreview(html);
        }.bind(this)
      );
      saveTheme.addEventListener('click', (e) => {
        e.preventDefault();
        const data = this._getFormData();
        this._saveTheme(data);
      });
      delThemeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        new Dialog({
          title: game.i18n.localize('RORM.theme.deleteThemeTitle'),
          content: game.i18n.localize('RORM.theme.deleteThemeDesc'),
          buttons: {
            delete: {
              label: game.i18n.localize('RORM.theme.deleteThemeTitle'),
              callback: function () {
                this._deleteTheme(themeSelect.value);
              }.bind(this)
            }
          }
        }).render(true);
      });
    }
    _prepareBgImgData(theme) {
      let data = deepClone(this.sidebarBackgrounds).map((i) => {
        i.selected = theme.sidebar.background === i.img ? true : false;
        return i;
      });
      return data;
    }
    _prepareColorData(arr) {
      for (let i of arr) {
        if (i.value.length > 7) {
          i.base = i.value.slice(0, 7);
          i.opacity = this._hexToPercent(i.value.slice(7));
        } else {
          i.base = i.value;
          i.opacity = 1;
        }
      }
      return arr;
    }
    _showSaveInput(html) {
      let saveControl = html.find('#save-control')[0];
      if (saveControl.classList.contains('hidden')) {
        saveControl.classList.add('fx');
        saveControl.classList.remove('hidden');
      }
    }
    _hideSaveInput(html) {
      let saveControl = html.find('#save-control')[0];
      if (!saveControl.classList.contains('hidden')) {
        saveControl.classList.remove('fx');
        saveControl.classList.add('hidden');
      }
    }
    _getFormData() {
      let html = this.form;
      const colorCellEl = [...html.querySelectorAll('.theme-color')];
      const sbGradEl = [...html.querySelectorAll('.sb-grad')];
      const sbcEl = html.querySelector('#--sidebar-color');
      const sbBgEl = html.querySelector('#sidebar-bg-select');
      const themeName = html.querySelector('#theme-name');
      const logoSelect = html.querySelector('#logo-select');
      const themeObj = {
        name: themeName.value,
        default: false,
        locked: false,
        logo: logoSelect.value,
        colors: [],
        sidebar: {
          colors: [],
          bgColor: sbcEl.dataset.color,
          background: sbBgEl.value
        }
      };
      colorCellEl.map((i) => {
        themeObj.colors.push({
          label: i.title,
          tag: i.id,
          value: i.dataset.color
        });
      });
      sbGradEl.map((i) => {
        themeObj.sidebar.colors.push({
          label: i.title,
          tag: i.getAttribute('name'),
          value: i.dataset.color,
          id: i.id
        });
      });
      return themeObj;
    }
    async _onSubmit(event) {
      super._onSubmit(event, { preventRefresh: true });
    }
    _updateCellColor(e) {
      let container = e.target.closest('.color-cell');
      let input = container.querySelector('.opacity-inp');
      let picker = container.querySelector('.hiddenpicker');
      const hexStr = this._getTransparentHexString(input.value, picker.value);
      container.dataset.color = hexStr;
    }
    _handleOpacityInput(e) {
      let container = e.target.closest('.color-cell');
      let clicker = container.querySelector('.colorclicker');
      let input = container.querySelector('.opacity-inp');
      let picker = container.querySelector('.hiddenpicker');
      let color = picker.value;
      input.classList.remove('hidden');
      input.value = picker.dataset.opacity;
      input.focus();
      input.addEventListener(
        'blur',
        function (e) {
          input.classList.add('hidden');

          const hexStr = this._getTransparentHexString(input.value, color);
          clicker.style.backgroundColor = hexStr;
          container.dataset.color = hexStr;
          picker.value = color;
          picker.dataset.opacity = input.value;
        }.bind(this),
        { once: true }
      );
    }
    parseThemeColors(data) {
      let colors = [];
      let filtered = ['theme-select', 'themeName'];
      for (let key in data) {
        if (!filtered.includes(key)) {
          const kData = data[key];
          if (key[0] == '-' && key[1] == '-') {
            colors.push({
              label: kData.label,
              tag: key,
              value: kData.value
            });
          } else if (key.includes('-')) {
            colors.push({
              label: kData.label,
              tag: key,
              value: kData.value
            });
          }
        }
      }
      let name = data.themeName.value;
      const retObj = {
        name,
        colors
      };
      return retObj;
    }
    async _applyTheme(name) {
      // const theme = await this._getTheme(name);
      const theme = this._getFormData();
      await game.settings.set(rclmod.modName, 'activeTheme', theme);
      rclmod.recolor(theme);
      this.render(true);
    }
    _displayThemeDelete(locked) {}
    async _updateThemeDisplay(name, html) {
      const theme = await this._getTheme(name);
      const themeDelBtn = html.find('.delete-theme-btn')[0];
      const logoImg = html.find('.logo-preview .image')[0];
      const logoSelect = html.find('#logo-select')[0];

      for (let color of theme.colors) {
        const cell = html.find(`#${color.tag}`)[0];
        this._setCellColor(cell, color.value);
      }
      for (let sbColor of theme.sidebar.colors) {
        const cell = html.find(`#${sbColor.id}`)[0];
        this._setCellColor(cell, sbColor.value);
      }
      this._setCellColor(html.find('#--sidebar-color')[0], theme.sidebar.bgColor);
      html.find('#sidebar-bg-select')[0].value = theme.sidebar.background;
      const preview = html.find('.preview')[0];
      preview.style.background = `url(modules/recolor-mod/assets/bg/${theme.sidebar.background}) repeat, 
        linear-gradient(0deg, 
        ${theme.sidebar.colors.filter((i) => i.id === 'sbgc')[0].value} 0%, 
        ${theme.sidebar.colors.filter((i) => i.id === 'sbgb')[0].value} 46%, 
        ${theme.sidebar.colors.filter((i) => i.id === 'sbga')[0].value} 100%), 
        url(modules/recolor-mod/assets/bg/${theme.sidebar.background}) repeat`;
      preview.style.backgroundColor = theme.sidebar.bgColor;
      logoImg.style.backgroundImage = `url('modules/recolor-mod/assets/icon/${theme.logo}')`;
      logoSelect.value = theme.logo;

      if (!theme.locked) {
        themeDelBtn.classList.remove('hidden');
      } else {
        themeDelBtn.classList.add('hidden');
      }
    }
    _updateSidebarPreview(html) {
      const preview = html.find('.preview')[0];
      const gradA = html.find('#sbga')[0];
      const gradB = html.find('#sbgb')[0];
      const gradC = html.find('#sbgc')[0];
      const bgImg = html.find('#sidebar-bg-select')[0];
      const bgColor = html.find('#--sidebar-color')[0];
      preview.style.background = `url(modules/recolor-mod/assets/bg/${bgImg.value}) repeat, 
        linear-gradient(0deg, 
        ${gradC.dataset.color} 0%, 
        ${gradB.dataset.color} 46%, 
        ${gradA.dataset.color} 100%), 
        url(modules/recolor-mod/assets/bg/${bgImg.value}) repeat`;
      preview.style.backgroundColor = bgColor.dataset.color;
    }
    _updateLogoPreview(img) {
      const html = this.form;
      const logoImg = html.querySelector('.logo-preview .image');
      logoImg.style.backgroundImage = `url('modules/recolor-mod/assets/icon/${img}')`;
    }
    async _getTheme(name) {
      const themes = deepClone(await game.settings.get(rclmod.modName, 'themes'));
      const theme = themes.filter((i) => i.name === name)[0];
      return theme;
    }
    _setCellColor(cell, color) {
      const colorData = this._prepareColorData([{ value: color }])[0];
      const colorEl = cell.querySelector('.colorclicker');
      const hiddenPicker = cell.querySelector('.hiddenpicker');
      hiddenPicker.value = colorData.base;
      hiddenPicker.dataset.opacity = colorData.opacity;
      colorEl.value = color;
      colorEl.style.backgroundColor = color;
      cell.dataset.color = color;
    }
    _getTransparentHexString(value, colorStr) {
      const hexVal = this._percentToHex(value);
      const str = `${colorStr}${hexVal}`;

      return str;
    }
    _percentToHex(value) {
      if (value < 0) value = 0;
      if (value > 1) value = 1;
      let hex = `${Math.floor(value * 255).toString(16)}`;
      hex = hex == 0 ? '00' : hex;
      return hex;
    }
    _hexToPercent(hexVal) {
      const a = ((parseInt(hexVal, 16) * 100) / 255) * 0.01;
      const b = Math.round(a * 100) / 100;
      return b;
    }
    async _saveTheme(data) {
      const themes = deepClone(await game.settings.get(rclmod.modName, 'themes'));
      const savedTheme = themes.find((i) => i.name === data.name);
      const locked = savedTheme ? savedTheme.locked : false;

      const existing = savedTheme ? true : false;

      if (!existing) {
        themes.push(data);
        await game.settings.set(rclmod.modName, 'themes', themes);
      } else if (!locked) {
        let tList = themes.filter((i) => i.name != savedTheme.name);
        tList.push(data);
        await game.settings.set(rclmod.modName, 'themes', tList);
      }
      let diag = new Dialog({
        title: game.i18n.localize('RORM.theme.changeTheme'),
        content: game.i18n.localize('RORM.theme.setSavedActive'),
        buttons: {
          apply: {
            label: game.i18n.localize('RORM.theme.changeTheme'),
            callback: async function () {
              this._applyTheme();
              this.render();
            }.bind(this)
          },
          close: {
            label: game.i18n.localize('RORM.theme.close'),
            callback: () => {
              diag.close();
            }
          }
        }
      }).render(true);
      await game.settings.set(rclmod.modName, 'activeTheme', data);
      // this.render();
    }
    async _deleteTheme(name) {
      const themes = deepClone(await game.settings.get(rclmod.modName, 'themes'));
      const selected = themes.find((i) => i.name === name);
      if (!selected.locked) {
        const newList = themes.filter((i) => i.name !== name);
        await game.settings.set(rclmod.modName, 'themes', newList);
        this.render();
      }
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
