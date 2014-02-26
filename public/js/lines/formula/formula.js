/**
    Evaluated formula.
    @module     lines/formula/formula
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Libraries */
    var MathJax     = require('mathjax'),
        latex       = require('latex'),
        mathjs      = require('mathjs');
    var math        = mathjs();

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /* Templates */
    var tplView     = require('tpl!lines/formula/view'),
        tplEdit     = require('tpl!lines/formula/edit'),
        tplTool     = require('text!lines/formula/tool.html');

    /**
     * Evaluated formula.
     * @exports lines/formula/formula
     */
    var formula = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new title.
             * @property {string} defaults.symbol - The parameter symbol.
             * @property {string} defaults.description - Parameter description.
             * @property {string} defaults.unit - Parameter calculation unit.
             * @property {string} defaults.savedValue - Previous value.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType: "Formula",
                description: "New Formula",
                symbol: "F",
                latex: "0",
                unit: "kN",
                state: 0
            },

            /**
             * Symbol library ID for this parameter.
             */
            sid: null,

            /**
             * LaTeX expressed with symbol library placeholders.
             */
            libraryLatex: null,

            /**
             * Formula expressed as an math.js expression.
             */
            formula: null,

            /**
             * Re-registers the formula symbol after import.
             */
            import: function() {
                this.sid = this.collection.depTree.registerToken(
                    this.cid,
                    this.get("symbol"),
                    this.get("state")
                );
            },

            /**
             * Parse a LaTeX expression into a math.js evaluable stirng.
             * While doing so, identify and abstract all the symbols/parameters.
             */
            tokenise: function () {
                _global.latexSymbols = [];
                _global.latexPosition = [];
                this.formula = latex.parse(this.get("latex"));

                var symbols = [];
                var splitLatex = this.get("latex").split();
                var tokens = _global.latexSymbols;
                var self = this;
                _.each(tokens, function (element, index, list) {
                    var pos = _global.latexPosition[index];

                    var sid =  self.collection.depTree.getSid(element);
                    var symbolFunc = '_model("' + element + '")';
                    self.formula = self.formula.replace(symbolFunc, '_sid("' + sid + '")');

                    splitLatex[pos] = "\\sid{" + sid + "}";
                    symbols.push(parseInt(sid));
                });
                this.libraryLatex = splitLatex.join('');
                this.dependents = _.uniq(symbols);
            },

            /**
             * Prepare formula for first evaluation after bulk import.
             */
            ready: function() {
                this.tokenise();
                this.collection.depTree.registerDependents(this.sid, this.dependents);
            },

            expression: function() {
                var lines = this.collection;
                /* jshint ignore:start */
                    // math.js gives us a safe eval, so ignore jshint.
                    return math.eval(this.formula, {
                        _sid: function(sid) {
                            var cid = lines.depTree.getTokenCid(sid);
                            return lines.get(cid).value;
                            }
                    });
                /* jshint ignore:end */
            },

        }),

        /* View extensions. */
        view: LineView.extend({

            templates: {
                view: tplView,
                edit: tplEdit
            },

            /**
             * Updates the cached symbol from the master library before rendering.
             */
            preRender: function() {
                if (this.sid !== undefined) {
                    this.model.set("symbol", this.model.collection.depTree.symbols[this.model.sid]);
                }
                if (this.libraryLatex !== undefined) {
                    var self = this;
                    _.each(this.dependents, function (element, index, list) {
                        var formattedLatex = this.get("latex");
                        var sidFunc = "\\sid{" + element + "}";
                        var sidSymbol = self.model.collection.depTree.symbols[sid];
                        formattedLatex = formattedLatex.replace(sidFunc, sidSymbol);
                    });
                }
            },

            /**
             * Converts inline LaTeX to set-out HTML after rendering.
             */
            postRender: function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
            }

        }),

        /* Toolbar item. */
        toolbar: tplTool

    };
    return formula;
});