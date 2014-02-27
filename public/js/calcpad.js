/**
 * CalcPad
 * https://github.com/thomasmichaelwallace/calcpad
 *
 * CalcPad is a web application for writing engineering calculations.
 * It provides an extensable library of 'lines' that can be used to form
 * even complex calculations from an easy to use graphical interface.
 *
 * Currently CalcPad is under preliminary development; so hope for great
 * things, even if they're not here yet!
 *
 * @author      thomas michael wallace <thomasmichaelwallace@googlemail.com>
 * @version     0.2.0
 * @date        2014-02-23
 * @copyright   Thomas Michael Wallace 2013-2014
 *
 * @license
 * Copyright (C) 2014 thomas michael wallace <thomasmichaelwallace@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

requirejs.config({
    baseUrl: 'js',
    paths: {
        'backbone':     '../lib/backbone/backbone',
        'bootstrap':    '../lib/bootstrap/bootstrap.min',
        'jquery':       '../lib/jquery/jquery',
        'mathjax':      '../lib/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML&amp;delayStartupUntil=configured',
        'mathquill':    '../lib/mathquill/mathquill',
        'mathjs':       '../lib/mathjs/math',
        'text':         '../lib/requirejs-text/text',
        'tpl':          '../lib/requirejs-tpl/tpl',
        'underscore':   '../lib/underscore/underscore',
    },
    shim: {
        'backbone': {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'jquery': {
            deps: [],
            exports: '$'
        },
        'mathjax': {
            exports: 'MathJax',
            init: function () {
                MathJax.Hub.Config({
                    displayAlign: "left"
                });
                MathJax.Hub.Startup.onload();
                MathJax.Hub.Configured();
                return MathJax;
            }
        },
        'mathquill': {
            deps: ['jquery']
        },
        'underscore': {
            deps: [],
            exports: '_'
        }
    },
    tpl: {
        extension: '.tpl'
    }
});

var _debug;
var _global = { latexPosition: [], latexSymbols: []};

// Start the main app logic.
requirejs(["cp-dev"],
    function (Pad) {
        _debug = Pad;
});