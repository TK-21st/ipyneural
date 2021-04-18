// Copyright (c) Chung-Heng Yeh
// Distributed under the terms of the Modified BSD License.

import {
    DOMWidgetModel, DOMWidgetView, ISerializers, uuid
  } from '@jupyter-widgets/base';

  import {
    typeset
  } from '@jupyter-widgets/controls';

  import {
    MODULE_NAME, MODULE_VERSION
  } from './version';

  import '../css/neural.css';

  import * as d3 from 'd3';

  export
  class NeuralModel extends DOMWidgetModel {
    defaults() {
      return {...super.defaults(),
        _model_name: NeuralModel.model_name,
        _model_module: NeuralModel.model_module,
        _model_module_version: NeuralModel.model_module_version,
        _view_name: NeuralModel.view_name,
        _view_module: NeuralModel.view_module,
        _view_module_version: NeuralModel.view_module_version,
        value : 'Neural',
        latex : '',
        graph : '',
        figure : '',
        figures : {'None': ''},
        src : {'nodes':[], 'edges': []},
      };
    }

    static serializers: ISerializers = {
        ...DOMWidgetModel.serializers,
        // Add any extra serializers here
      }
    static model_name = 'NeuralModel';
    static model_module = MODULE_NAME;
    static model_module_version = MODULE_VERSION;
    static view_name = 'NeuralView';   // Set to null if no view
    static view_module = MODULE_NAME;   // Set to null if no view
    static view_module_version = MODULE_VERSION;
  }


  export
  class NeuralView extends DOMWidgetView {

    render() {

      let svg = document.createElementNS(d3.namespaces.svg, 'svg');
      let tooltip = document.createElement('div');
      tooltip.className = 'ipyneural-tooltip';

      this.svg = d3.select(svg);
      this.svg.attr('viewBox', "0 0 0 0");
      this.svg.attr('width', '100%');
      this.svg.attr('preserveAspectRatio', 'none');
      this.g = this.svg.append('g')
      this.g.attr("transform", "translate(5, 5)");
      this.tooltip = d3.select(tooltip);

      let defs = this.g.append("defs");

      defs.append("marker")
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto')
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");

      this.el.appendChild(svg);
      this.el.appendChild(tooltip);
      this.el.id = uuid();

      this.src_changed();
      this.model.on('change:src', this.src_changed, this);
      this.model.on('change:figures', this.figures_changed, this);
    }

    typeset(element: HTMLElement, text?: string) {
      this.displayed.then(() => typeset(element, text));
    }

    figures_changed() {
      let figures = this.model.get('figures');

      for (const key of Object.keys(figures)) {
        this.data[key]['figure'] = figures[key];
      }
    }

    src_changed() {
      this.data = {};

      let src = this.model.get('src');
      let viewbox = src['viewbox'].split(' ')
      let w = parseInt(viewbox[2])+10;
      let h = parseInt(viewbox[3])+10;

      this.svg.attr('viewBox', "0 0 " + w + " " + h);

      for (var i = 0; i < src['elements'].length; ++i) {
        let el = src['elements'][i]
        let label = el['label'];
        let group = this.g.append('g')
          .attr('id', label[0])
          .style('pointer-events', 'all');

        if (el['shape'] == 'rect') {
          group.attr('class', 'hoverable');
          this.data[label[0]] = {
            'latex': el['latex'],
            'graph': el['graph'],
            'figure': ''};
        }


        let text = group.append('text');
        text.attr('x', label[1])
          .attr('y', label[2]+5)
          .attr('font-family', 'sans-serif')
          .attr('font-size', '11px')
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .text(label[0]);

        let shape = group.append(el['shape']);
        let attrs = el['attrs'];
        for (const key of Object.keys(attrs))
          shape.attr(key, attrs[key]);

        if (el['shape'] == 'path')
          shape.attr('marker-end', 'url(#arrow)');

      }
      var _this = this;
      this.g.selectAll(".hoverable")
        .on("mouseover", function (event: any, d: any) {
          let target = d3.select(event.currentTarget);
          _this.g.selectAll('g')
            .style("opacity", 0.4);
          target.style("opacity", 1.0);

          let dom = _this.tooltip.node();
          dom.innerHTML = _this.data[target.attr('id')]['latex'];
          _this.typeset(dom);
          _this.tooltip
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
            .transition()
            .duration(200)
            .style("opacity", .9);
        })
        .on("mouseout", function(d: any) {
          _this.g.selectAll('g')
            .style("opacity", 1.0);
          _this.tooltip.transition()
            .duration(500)
            .style("opacity", .0)
        })
        .on("click", function(event: any, d: any) {
          let _id = d3.select(event.currentTarget).attr('id');

          _this.model.set('value', _id);
          _this.model.set('label', "<h2>" + _id + "</h2>");
          _this.model.set('latex', _this.data[_id]['latex']);
          _this.model.set('graph', _this.data[_id]['graph']);
          _this.model.set('figure', _this.data[_id]['figure']);
          // _this.touch();
        });
    }

    data: any | undefined;
    tooltip: any | undefined;
    svg: any | undefined;
    g: any | undefined;
  }

  export
  class MultiFigureModel extends DOMWidgetModel {
    defaults() {
      return {...super.defaults(),
        _model_name: MultiFigureModel.model_name,
        _model_module: MultiFigureModel.model_module,
        _model_module_version: MultiFigureModel.model_module_version,
        _view_name: MultiFigureModel.view_name,
        _view_module: MultiFigureModel.view_module,
        _view_module_version: MultiFigureModel.view_module_version,
        id : '',
        cid : '',
        value : '',
        figures : {}
      };
    }

    static serializers: ISerializers = {
        ...DOMWidgetModel.serializers,
        // Add any extra serializers here
      }

    static model_name = 'MultiFigureModel';
    static model_module = MODULE_NAME;
    static model_module_version = MODULE_VERSION;
    static view_name = 'MultiFigureView';   // Set to null if no view
    static view_module = MODULE_NAME;   // Set to null if no view
    static view_module_version = MODULE_VERSION;
  }

  export
  class MultiFigureView extends DOMWidgetView {

    initialize() {
      this.el.id = uuid() ;
      this.model.set('id', this.el.id);
      this.touch();
    }

    render() {
      this.figures_changed();
      this.model.on('change:figures', this.figures_changed, this);
      this.model.on('change:value', this.value_changed, this);
    }

    figures_changed() {
      let figures = this.model.get('figures');
      this.el.innerHTML = "";

      this.d3_el = d3.select(this.el);

      for (const key of Object.keys(figures)) {
        let obj = figures[key];
        let d3_div = this.d3_el.append('div')
          .attr('id', 'figs-' + key)
          .attr('class', 'figure-container');
        for (const attr of Object.keys(obj)) {
          let div_fig = d3_div.append('div')
            .attr('id', this.el.id + '-' + key + '-' + attr)
            .attr('class', 'figure-wrapper');
          let blob = new Blob([obj[attr]], {type: "image/PNG"});
          let url = URL.createObjectURL(blob);
          let ul = div_fig.append('ul');
          ul.append('li').append('span').classed('add', true).html('&plus;');
          ul.append('li').append('span').classed('up', true).html('&rarr;');
          ul.append('li').append('span').classed('down', true).html('&rarr;');
          div_fig.append('img').attr('src', url);
          this.enable_wrapper_click(div_fig)
        }
      }
    }

    value_changed() {
      let value = '#figs-' + this.model.get('value');
      this.d3_el.selectAll('.figure-container').classed('selected', false);
      this.d3_el.select(value).classed('selected', true);
    }

    enable_wrapper_click(wrapper: any | undefined) {
      let _this = this;

      wrapper.select('span.add')
        .on('click', function (event:any) {
          let target = event.currentTarget;
          let wrapper = d3.select(target.parentNode.parentNode.parentNode);

          if (wrapper.classed('selected')) {
            let _id = wrapper.attr('id');
            d3.selectAll(`[id="${_id}"]`)
              .each(function (d: any, i: any, n: any) {
                let _wrapper = d3.select(n[i]);
                if (_wrapper.classed('cloned')) {
                  _wrapper.remove();
                } else {
                  _wrapper
                    .classed('selected', false)
                    .select('span.add').html('&plus;');
                }
              });
          } else {
            wrapper.select('span.add').html('&minus;');
            wrapper.classed('selected', true);
            let cid = _this.model.get('id') + '-div';
            let selection = d3.selectAll(`[id="${cid}"]`);
            if ( !selection.empty() ) {
              selection
                .each(function (d: any, i: any, n: any) {
                    let clone = wrapper.node().cloneNode(true);
                    let d3_clone = d3.select(clone).classed('cloned', true);
                    _this.enable_wrapper_click(d3_clone);
                    n[i].appendChild(clone);
                });
            }
          }
        });
      wrapper.select('span.up')
        .on('click', function (event: any) {
          let target = event.currentTarget;
          let wrapper = target.parentNode.parentNode.parentNode;

          if (wrapper.previousSibling != null) {
            let container = wrapper.parentNode;
            container.insertBefore(wrapper, wrapper.previousSibling);
          }
        });
      wrapper.select('span.down')
        .on('click', function (event: any) {
          let target = event.currentTarget;
          let wrapper = target.parentNode.parentNode.parentNode;

          if (wrapper.nextSibling != null) {
            let container = wrapper.parentNode;
            container.insertBefore(wrapper.nextSibling, wrapper);
          }
        });
    }
    move_forward(element: HTMLElement) {
      if (element.previousSibling != null) {
        let parent = element.parentNode;
        if (parent != null)
          parent.insertBefore(element, element.previousSibling);
      }
    }
    d3_el : any | undefined;
  }

  export
  class FigureCompareModel extends DOMWidgetModel {
    defaults() {
      return {...super.defaults(),
        _model_name: FigureCompareModel.model_name,
        _model_module: FigureCompareModel.model_module,
        _model_module_version: FigureCompareModel.model_module_version,
        _view_name: FigureCompareModel.view_name,
        _view_module: FigureCompareModel.view_module,
        _view_module_version: FigureCompareModel.view_module_version,
        pid : ''
      };
    }

    static serializers: ISerializers = {
        ...DOMWidgetModel.serializers,
        // Add any extra serializers here
      }

    static model_name = 'FigureCompareModel';
    static model_module = MODULE_NAME;
    static model_module_version = MODULE_VERSION;
    static view_name = 'FigureCompareView';   // Set to null if no view
    static view_module = MODULE_NAME;   // Set to null if no view
    static view_module_version = MODULE_VERSION;
  }

  export
  class FigureCompareView extends DOMWidgetView {
    render() {
      this.pid_changed();
      this.model.on('change:pid', this.pid_changed, this);
    }
    pid_changed() {
      this.el.innerHTML = "";
      let div = undefined;
      let div_id = this.model.get('pid') + '-div';
      let element = document.getElementById(div_id);
      if (element == null) {
        div = document.createElement('div');
        div.className = 'figure-container selected';
        div.id = div_id;
      } else {
        div = element.cloneNode(true);

      }
      this.el.appendChild(div);
    }
  }
