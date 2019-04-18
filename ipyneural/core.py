#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung-Heng Yeh.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget
from traitlets import Unicode
from ._frontend import module_name, module_version


class NeuralWidget(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('NeuralModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('NeuralView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    value = Unicode('Neural').tag(sync=True)
    label = Unicode('').tag(sync=True)
    latex = Unicode('').tag(sync=True)
    graph = Bytes(b'').tag(sync=True)
    figure = Bytes(b'').tag(sync=True)
    figures = Dict({'None': ''}).tag(sync=True)
    src = Dict({'nodes':[], 'edges': []}).tag(sync=True)

class MultiFigureWidget(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('MultiFigureWidget').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('MultiFigureView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    id = Unicode('').tag(sync=True)
    cid = Unicode('').tag(sync=True)
    value = Unicode('').tag(sync=True)
    figures = Dict({'None': ''}).tag(sync=True)

class FigureCompareWidget(Output):
    """TODO: Add docstring here
    """
    _model_name = Unicode('FigureCompareModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('FigureCompareView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    pid = Unicode('').tag(sync=True)
