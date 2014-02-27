/**
 * CalcPad - Line Type Definitions
 * Copyright (C) 2014 Thomas Michael Wallace
 * Apache 2 Licensed
 */

// Line type definitions for CalcPad.

// This is not correctly modular at the moment, but it clears the dev.evelopment pad.
define(["cp-dev"], function(Pad) {

    math = mathjs();

    // Implementations of line types.
    return {

        /**
         * Direct variable input.
         */
        Input: {
            model: LineItem.extend({
            }),
            view: LineView.extend({

                preEdit: function() {
                    this.$(".mathquill-editable").mathquill('editable');
                },
                preSave: function() {
                    var latex = this.$(".mathquill-editable").mathquill('latex');
                    DepTree.removeSymbol(this.model);
                    this.model.set('symbol', latex);
                    DepTree.addSymbol(this.model);
                }

            }),
        },

        /**
         * Simple formula.
         */
        Formula: {
            model: LineItem.extend({

                load: function() {
                    var latexStr = this.get("latex");
                    var mathStr = latex.parse(latexStr);
                    this.set('formula', mathStr);
                },

                setDeps: function() {
                    this.tokenise(this.get('formula'));
                }
            }),
            view: LineView.extend({
                events: {"click #statebar a":    "where"},
                where: function(e) {
                    var whereId = e.currentTarget.id;
                    DepTree.removeDependents(this.model);
                    this.model.set("state", whereId);
                    DepTree.addDependents(this.model);
                },
                postRender: function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
                    this.$(".mathquill-editable").mathquill('editable');
                    this.$(".mathquill-view").mathquill();
                },
                preEdit: function() {
                },
                preSave: function() {
                    DepTree.removeSymbol(this.model);
                    var symbol = this.$('#symbol').mathquill('latex');
                    this.model.set('symbol', symbol);
                    DepTree.addSymbol(this.model);
                    var latexStr = this.$(".mathquill-editable").mathquill('latex');
                    this.model.set('latex', latexStr);
                    var mathStr;
                    try {
                        mathStr = latex.parse(latexStr);
                    } catch (e) {
                        this.addMessage("Parser", "danger", "Cannot evaluate formula.", false);
                        return false;
                    }
                    this.model.set('formula', mathStr);
                    var exp = this.model.setDeps();
                    this.model.collection.calculate([this.model.cid]);
                    return true;
                },


            }),
            toolbar: 'f(x)'
        },


        /**
         * Conditional state setter.
         */
        Condition: {
            model: LineItem.extend({

                load: function() {
                    var latexStr = this.get("latex");
                    var mathStr = latex.parse(latexStr);
                    this.set('formula', mathStr);
                    DepTree.addState(this);
                },
                expression: function () {
                    /* jshint ignore:start */
                    var result;
                    // math.js gives us a safe eval, so ignore jshint.
                    result = math.eval(this.get("formula"), this.collection.scope);
                    /* jshint ignore:end */
                    DepTree.switchState(this.get("condition"), result);
                    return result;
                },
                tokenise: function(symbolLatex) {
                    // Clear dependents.
                    DepTree.removeDependents(this);

                    // Build symbol library (todo: make global)
                    var symbolLib = [];
                    _.each(this.collection.models, function(element, index, list){
                        var symbol = element.get("symbol");
                        if (symbol !== undefined || symbol !== null) {
                            symbolLib.push(element.get("symbol"));
                        }
                    });
                    // Reverse sort to prevent false matches.
                    symbolLib = symbolLib.sort();
                    symbolLib = symbolLib.reverse();

                    var symbols = [];
                    _.each(symbolLib, function(element, index, list){
                        var symbolFunc = '_model("' + element + '")';
                        if (symbolLatex.contains(symbolFunc)) {
                            //var sid = DepTree.symbolMap[element];
                            symbols.push(element);
                        }
                    });
                    if (symbols.length > 0) {
                        this.dependents = symbols;
                    } else {
                        this.dependents = [null];
                    }
                    DepTree.addDependents(this);
                },
                setDeps: function() {
                    this.tokenise(this.get('formula'));
                }
            }),
                },
                postRender: function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
                    this.$(".mathquill-editable").mathquill('editable');
                },
                preEdit: function() {
                },
                preSave: function() {
                    DepTree.removeSymbol(this.model);
                    var symbol = this.$('#symbol').mathquill('latex');
                    this.model.set('symbol', symbol);
                    DepTree.addSymbol(this.model);
                    var latexStr = this.$(".mathquill-editable").mathquill('latex');
                    this.model.set('latex', latexStr);
                    var mathStr;
                    try {
                        mathStr = latex.parse(latexStr);
                    } catch (e) {
                        this.addMessage("Parser", "danger", "Cannot evaluate formula.", false);
                        return false;
                    }
                    this.model.set('formula', mathStr);
                    var exp = this.model.setDeps();
                    this.model.collection.calculate([this.model.cid]);
                    return true;
                },


            }),
        }

    };

}
)