// Copyright (c) Chung-Heng Yeh
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';


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
      value : 'Neural'
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
    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    this.el.textContent = this.model.get('value');
  }
}
