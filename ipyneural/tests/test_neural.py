#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung-Heng Yeh
# Distributed under the terms of the Modified BSD License.

import pytest

from ..core import NeuralWidget


def test_neural_creation_blank():
    w = NeuralWidget()
    assert w.value == 'Neural'
