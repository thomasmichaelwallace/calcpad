/**
    Test condition to set state.
    @module     lines/condition/condition
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
    var tplView     = require('tpl!lines/condition/view'),
        tplEdit     = require('tpl!lines/condition/edit'),
        tplTool     = require('text!lines/condition/tool.html');

    /**
     * Test condition to set state.
     * @exports lines/condition/condition
     */
    var condition = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new title.
             * @property {string} defaults.description - Test prefix description.
             * @property {string} defaults.latex - Test as LaTeX string.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType: "Condition",
                description: "Where:",
                latex: "1 + 1 = 2",
                condition: "1"
            },

            /**
             * LaTeX expressed with symbol library placeholders.
             */
            libraryLatex: null,

            /**
             * condition expressed as an math.js expression.
             */
            condition: null,

            /**
             * Re-registers the condition symbol after import.
             */
            import: function() {
                this.symbol = "\\state{" + this.get("condition") + "}";
                this.sid = this.collection.depTree.registerToken(
                    this.cid,
                    this.symbol,
                    0
                );
            },

            /**
             * Parse a LaTeX expression into a math.js evaluable stirng.
             * While doing so, identify and abstract all the symbols/parameters.
             */
            tokenise: function () {
                _global.latexSymbols = [];
                _global.latexPosition = [];
                this.condition = latex.parse(this.get("latex"));

                var symbols = [];
                var splitLatex = this.get("latex").split();
                var tokens = _global.latexSymbols;
                var self = this;
                _.each(tokens, function (element, index, list) {
                    var pos = _global.latexPosition[index];

                    var sid =  self.collection.depTree.getSid(element);
                    var symbolFunc = '_model("' + element + '")';
                    self.condition = self.condition.replace(symbolFunc, '_sid("' + sid + '")');

                    splitLatex[pos] = "\\sid{" + sid + "}";
                    symbols.push(parseInt(sid));
                });
                this.libraryLatex = splitLatex.join('');
                this.dependents = _.uniq(symbols);
            },

            /**
             * Prepare condition for first evaluation after bulk import.
             */
            ready: function() {
                this.tokenise();
                this.collection.depTree.registerDependents(this.sid, this.dependents);
            },

            expression: function() {
                var lines = this.collection;
                /* jshint ignore:start */
                    // math.js gives us a safe eval, so ignore jshint.
                    var result = math.eval(this.condition, {
                        _sid: function(sid) {
                            var cid = lines.depTree.getTokenCid(sid);
                            return lines.get(cid).value;
                            }
                    });
                /* jshint ignore:end */
                console.log("exp");
                console.log(this.get("condition"));
                console.log(result);
                this.collection.depTree.switchState(this.get("condition"), result);
                return result;
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
    return condition;
});