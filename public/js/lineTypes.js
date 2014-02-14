/**
 * CalcPad - Line Type Definitions
 * Copyright (C) 2014 Thomas Michael Wallace
 * Apache 2 Licensed
 */

// Line type definitions for CalcPad.

// This is not correctly modular at the moment, but it clears the dev.evelopment pad.

function loadTypes(LineItem, LineView) {

    math = mathjs();

    // Implementations of line types.
    return {

        /**
         * Primary header.
         */
        Title: {
            model: LineItem.extend({
                defaults: {
                    lineType: "Title",
                    text: "New Title"
                }
            }),
            view: LineView.extend({
                templates: {
                    view: _.template('<h3><%= text %></h3>'),
                    edit: _.template('<input type="text" name="text" class="form-control first-element" value="<%= text %>"">')
                }
            }),
            toolbar: '<span class="glyphicon glyphicon-header"></span>'
        },

        /**
         * Secion header.
         */
        SectionTitle: {
            model: LineItem.extend({
                defaults: {
                    lineType: "SectionTitle",
                    text: "New Title"
                }
            }),
            view: LineView.extend({
                templates: {
                    view: _.template('<h4><%= text %></h4>'),
                    edit: _.template('<input type="text" name="text" class="form-control first-element" value="<%= text %>"">')
                }
            }),
            toolbar: '<span class="glyphicon glyphicon glyphicon-bold"></span>'
        },

        /**
         * Paragraph.
         */
        Paragraph: {
            model: LineItem.extend({
                defaults: {
                    lineType: "Paragraph",
                    bodyText: "New Paragraph"
                }
            }),
            view: LineView.extend({
                templates: {
                    view: _.template('<div class="paragraph-fix"><p><%= formattedText %></p></div>'),
                    edit: _.template('<textarea type="text" name="bodyText" class="form-control first-element last-element"><%= bodyText %></textarea>')
                },
                preRender: function() {
                    this.model.set('formattedText', this.model.get('bodyText').replace('\n', '<p></p>'));
                }
            }),
            toolbar: '<span class="glyphicon glyphicon-align-justify"></span>'
        },

        /**
         * Static Image.
         */
        Image: {
            model: LineItem.extend({
                defaults: {
                    lineType: "Image",
                    image: ""
                }
            }),
            view: LineView.extend({
                templates: {
                    view: _.template('<img src="<%= image %>" class="img-rounded img-responsive img-center">'),
                    edit: _.template('<p>Images cannot be edited at the moment.</p>')
                }
            })
        },

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
                        '<div class="form-horizontal">',
                            '<div class="form-group list-form-group">',
                                '<div class="col-sm-7">',
                                    '<p class="form-control-static"><%= description %></p>',
                                '</div>',
                                '<div class="col-sm-5">',
                                    '<div class="input-group">',
                                        '<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
                                        '<input type="text" class="form-control scope-value" value="<%= value %>">',
                                        '<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join('\n')),
                    edit: _.template([
                        '<div class="form-horizontal">',
                            '<div class="form-group list-form-group">',
                                '<div class="col-sm-7">',
                                    '<input type="text" class="form-control first-element" name="description" value="<%= description %>">',
                                '</div>',
                                '<div class="col-sm-5">',
                                    '<div class="input-group">',
                                        '<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
                                        '<p class="form-control"><%= value %></p>',
                                        '<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join('\n'))
                },
                events: {
                    "change .scope-value"       : "updateScope"
                },
                postRender: function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
                },
                updateScope: function() {
                    this.model.updateValue(parseFloat(this.$('.scope-value').val()));
                    this.model.collection.calculate([this.model.id]);
                }
            })
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
                },
                load: function() {
                    if (this.get("deps") !== undefined) {
                        this.dependents = this.get("deps");
                    }
                },
                expression: function () {
                    console.log(this.get("formula"));
                    /* jshint ignore:start */
                    // math.js gives us a safe eval, so ignore jshint.
                    return math.eval(this.get("formula"), this.collection.scope);
                    /* jshint ignore:end */
                },
            }),
            view: LineView.extend({
                templates: {
                    view: _.template([
                        '<p><%= description %></p>',
                        '<div class="latex-line">',
                            '\\[<%= symbol %> = <%= latex %>\\]',
                        '</div>',
                        '<div class="form-horizontal">',
                            '<div class="form-group list-form-group">',
                                '<div class="col-sm-7">',
                                '</div>',
                                '<div class="col-sm-5">',
                                    '<div class="input-group">' ,
                                        '<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
                                        '<p class="form-control"><%= value %></p>',
                                        '<span class="input-group-addon latex-addon">\\(\\mathrm{<%= units %>}\\)</span>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join('\n')),
                    edit: _.template('<p>Formulas cannot be edited at the moment.</p>')
                },
                postRender: function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
                }
            })
        }

    };

}