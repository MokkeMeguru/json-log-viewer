const blessed = require('blessed');
const _ = require('lodash');

const BaseWidget = require('./BaseWidget');

class StatusLine extends blessed.Box {
  constructor(opts={}) {
    super(Object.assign({}, {
      top: opts.screen.height-1,
      left: 0,
      width: '100%',
      height: 1,
      tags: true,
      style: {
        fg: 'white',
        bg: 'blue',
      },
    }, opts));

    this.mainPanel = opts.mainPanel;
    this.mainPanel.on('update', this.update.bind(this));
    this.update();
  }

  log(...s) {
    this.screen.log(...s);
  }

  get row() { return this.mainPanel.row+1; }
  get lastRow() { return this.mainPanel.lastRow+1; };
  get mode() { return this.mainPanel.mode.toUpperCase(); }
  get sort() { return this.mainPanel.sort; }
  get filters() {
    const { filters, levelFilter } = this.mainPanel;
    if (this.mainPanel.levelFilter) {
      return filters.concat({ key: 'level', value: levelFilter });
    }
    return filters;
  }

  update() {
    const mode = `{yellow-bg}{black-fg}{bold} ${this.mode} {/}`;
    const line = `{bold}${this.row}{/}/{bold}${this.lastRow}{/}`;
    const sort = this.sort ? `| sort: {bold}${this.sort}{/}` : '';
    const filterExpr = this.filters.map(f => `${f.key}:${f.value}`).join(' ');
    const filters = filterExpr ? `| filters: {bold}${filterExpr}{/}` : '';
    this.log('status updated', this.filters, filters);
    this.log('filters', [ { key: 'level', value: 'error' } ].map(f => `${f.key}:${f.value}`));
    this.setContent(` ${mode} ${line} ${sort} ${filters}`);
    this.screen.render();
  }
}

module.exports = StatusLine;