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
                defaults: {
                    lineType: "Input",
                    symbol: "",
                    description: "New Parameter",
                    unit: "kN",
                    savedValue: 10
                },
                load: function() {
                    if (this.get("savedValue") !== undefined) {
                        this.value = this.get("savedValue");
                    }
                }
            }),
            view: LineView.extend({
                templates: {
                    view: _.template([

                    ].join('\n')),
                    edit: _.template([

                    ].join('\n'))
                },
                events: {
                    "change .scope-value"       : "updateScope"
                },

                updateScope: function() {
                    var value = parseFloat(this.$('.scope-value').val());
                    if (!isNaN(value)) {
                        this.model.updateValue(value);
                        this.model.collection.calculate([this.model.cid]);
                    } else {
                        this.addMessage("NaN", "warning", "Value is not a number.", true);
                    }
                },
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
                defaults: {
                    lineType: "Formula",
                    description: "New Parameter",
                    symbol: "P",
                    latex: "0",
                    formula: "0.0",
                    unit: "kN",
                    state: "0",
                },
                load: function() {
                    var latexStr = this.get("latex");
                    var mathStr = latex.parse(latexStr);
                    this.set('formula', mathStr);
                },
                expression: function () {
                    /* jshint ignore:start */
                    // math.js gives us a safe eval, so ignore jshint.
                    return math.eval(this.get("formula"), this.collection.scope);
                    /* jshint ignore:end */
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
            view: LineView.extend({
                templates: {
                    view: _.template([
                        '<p><%= description %></p>',
                        '<div class="latex-line">',
                            '\\[<%= symbol %> = <%= latex %>\\]',
                        '</div>',
                        '<div class="form-horizontal conditional">',
                            '<div class="form-group list-form-group">',
                                '<div class="col-sm-7">',
                                '</div>',
                                '<div class="col-sm-5">',
                                    '<div class="input-group">' ,
                                        '<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
                                        '<p class="form-control">',
                                            '<% if(value !== null && value !== undefined) { %>',
                                                '<%= value.toPrecision(3) %>',
                                            '<% } %>',
                                        '</p>',
                                        '<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join('\n')),
                    edit: _.template([
                        '<div class="form-horizontal">',
                            '<span class="mathquill-editable mathquill-bootstrap mathquill-bootstrap-area"><%= latex %></span>',
                        '</div>',
                        '<div class="form-horizontal">',
                            '<div class="form-group list-form-group">',
                                '<div class="col-sm-7">',
                                    '<input type="text" class="form-control first-element" name="description" value="<%= description %>">',
                                '</div>',
                                '<div class="col-sm-3">',
                                    '<span class="mathquill-editable mathquill-bootstrap" id="symbol"><%= symbol %></span>',
                                '</div>',
                                '<div class="col-sm-2">',
                                    '<input type="text" class="form-control" name="unit" value="<%= unit %>">',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="form-horizontal">',
                            '<div class="dropdown">',
                                '<a data-toggle="dropdown" href="#">',
                                    'Where',
                                    '<span class="caret"></span>',
                                '</a>',
                                '<ul id="statebar" class="dropdown-menu" role="menu" aria-labelledby="dLabel">',
                                    '<li role="presentation" class="dropdown-header">Where:</li>',
                                    '<% _.each(DepTree.states, function(state) { %>',
                                        '<li role="presentation"><a class="mathquill-view" id="<%= Lines.get(state).get("condition") %>" role="menuitem" tabindex="-1" href="#"><%= Lines.get(state).get("latex") %></a></li>',
                                    '<% }); %>',
                                '</ul>',
                            '</div>',
                        '</div>'
                    ].join('\n'))
                },
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
                defaults: {
                    lineType: "Condition",
                    description: "Where:",
                    latex: "1 + 1 = 2",
                },
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
            view: LineView.extend({
                templates: {
                    view: _.template([
                        '<%= description %>',
                        '<div class="pull-right">',
                            '<% if (value) { %>',
                                '<span class="align-right label label-success"><span class="glyphicon glyphicon-ok"></span></span>',
                            '<% } else { %>',
                                '<span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span>',
                            '<% } %>',
                        '</div>',
                        '<div class="latex-line">',
                            '\\[<%= latex %>\\]',
                        '</div>'
                    ].join('\n')),
                    edit: _.template([
                        '<div class="form-horizontal">',
                            '<div class="form-group list-form-group">',
                                '<div class="col-sm-12">',
                                    '<input type="text" class="form-control first-element" name="description" value="<%= description %>">',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="form-horizontal">',
                            '<span class="mathquill-editable mathquill-bootstrap mathquill-bootstrap-area"><%= latex %></span>',
                        '</div>'
                    ].join('\n'))
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
            toolbar: '<span class="glyphicon glyphicon-question-sign"></span>'
        }

    };

}
)