export const recolorControls = (controls) => {
  let global = game.settings.get('recolor-mod', 'forceGlobalTheme');
  const controlObj = {
    activeTool: 'recolor',
    icon: 'fas fa-palette',
    layer: 'recolor',
    name: 'recolor-mod',
    title: 'recolor mod',
    tools: [
      {
        name: 'recolor',
        title: 'Recolor',
        icon: 'fas fa-brush',
        button: true,
        onClick: () => {
          const form = new rclmod.ColorSettings();
          form.render(true);
        }
      },
      {
        name: 'reset',
        title: 'Reset Themes',
        icon: 'fas fa-recycle',
        button: true,
        onClick: () => {
          new Dialog({
            title: 'Test Dialog',
            content: `<p>This will delete any saved themes and revert to default settings</p>
          <p>Are your sure?</p>`,
            buttons: {
              one: {
                icon: '<i class="fas fa-check"></i>',
                label: 'yes',
                callback: () => rclmod.resetThemes()
              },
              two: {
                icon: '<i class="fas fa-times"></i>',
                label: 'no',
                callback: () => {}
              }
            }
          }).render(true);
        }
      }
    ],
    visible: true
  };
  if ((!global || game.user.isGM)) {
    controls.push(controlObj);
  }
};

export function registerLayers() {
  CONFIG.Canvas.layers.recolor = { layerClass: ControlsLayer, group: 'interface' };
}

export function releaseLayer() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && canvas.recolor._active) {
      canvas.recolor._active = false;
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape'
        })
      );
    }
  });
}
