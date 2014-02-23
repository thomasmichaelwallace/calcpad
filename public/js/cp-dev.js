/**
    CalcPad application instance.
    @module     CalcPad
    @requires   Backbone
    @requires   underscore
*/
define(function (require) {
    "use strict";

    /* Libraries */
    var _               = require('underscore'),
        BackBone        = require('backbone'),
        $               = require('jquery');

    /* Modules */
    var LineTypes       = require('LineTypes'),
        LineCollection  = require('LineCollection'),
        DepTree         = require('DepTree');

    var PadView = Backbone.View.extend({
        /**
         * Prototype view of the lines collection, forming a coherent pad.
         * @lends PadView.prototype
         */

        /**
         * Shared reference to the line currently being edited.
         * @private
         */
        editing: undefined,

        /**
         * The containing element of the whole calculation pad.
         *
         * @see {@link http://backbonejs.org/#View-el|Backbone.js}
         * @private
         */
        el: $(".container"),

        /** @constructs */
        initialize: function() {
            this.buildToolbar();

            this.listenTo(Lines, 'add', this.add);
            this.listenTo(Lines, 'edit', this.edit);
            this.listenTo(Lines, 'close', this.close);

            Lines.fetch({
                success: function(model, response) {
                    // Build the update order for the first time.
                    _.each(Lines.models, function(element, index, list) {
                        DepTree.addSymbol(element);
                    });
                    _.each(Lines.models, function(element, index, list) {
                        //element.setDeps(); //.bind(element);
                        DepTree.addDependents(element);
                    });
                    DepTree.sort();
                    Lines.calculate();
                }
            });
        },

        edit: function(options) {
            if (options.view === undefined) { return; }

            if (this.editing !== undefined) {
                this.editing.$el.removeClass("editing");
            }
            this.editing = options.view;

            $("#toolbar").detach().insertAfter(options.view.$el);
            $("#toolbar").addClass("toolbar-on");
        },

        close: function(options) {
            if (options.view === undefined) { return; }

            this.editing = undefined;

            $("#toolbar").removeClass("toolbar-on");
        },

        /**
         * Build the toolbar from the imported line types.
         *
         * @private
         */
        buildToolbar: function() {
            var first=" last-element";  // Only applied to the first button.
            var toolbar = this.$("#toolbar-menu");
            _.each(LineTypes, function(element, index, list) {
                if (element.toolbar !== undefined) {
                    toolbar.append([
                        '<button type="button" name="' + index + '"',
                        ' class="btn btn-default navbar-btn' + first + '">',
                            element.toolbar,
                        '</button>'
                    ].join('\n'));
                    first="";
                }
            });
        },

        /**
         * Append a new line view when a new line item is added.
         *
         * @see {@link http://backbonejs.org/#Collection-add|Backbone.js}
         * @private
         */
        add: function(line, collection, options) {
            var view;
            if (line.get("lineType") in LineTypes) {
                view = new LineTypes[line.get("lineType")].view({ model: line });
            } else {
                view = new LineTypes.Blank.view({ model: line});
            }
            if (options !== undefined && "at" in options) {
                // Lines added with the toolbar are done so with position.
                this.$('#pad a:nth-child(' + options.at + ')')
                        .after(view.render().el);
            } else {
                // During fetch lines are just appended to the end.
                this.$("#pad").append(view.render().el);
            }
        }

    });

    // Stop click propegation in an editor.
    $("div").on('mousedown', ".edit", function (){
        return false;
    });
    // Stop click propegation in the toolbar.
    $("div").on('mousedown', "#toolbar", function (){
        return false;
    });
    // Clicking on another view closes the editor, saving changes.
    $("div").on('mousedown', ".view", function (){
        if (Pad.editing !== undefined) {
            Pad.editing.close(true);
            return false;
        }
    });
    // Clicking outside the calculation closes the editor, saving changes.
    $('body').on('mousedown', null, function () {
        if (Pad.editing !== undefined) {
            Pad.editing.close(true);
            return false;
        }
    });
    // Pressing enter closes the editor, saving changes.
    $("div").on('keypress', ".edit", function (e) {
        if (e.keyCode != 13) return;
        if (Pad.editing !== undefined) {
            Pad.editing.close(true);
        }
    });

    // Automatically select all the text in an input box.
    $("#pad").on('click', 'input', function () {
        $(this).select();
    });
    $("#pad").on('focus', 'input', function () {
        $(this).select();
    });

    // Tabing from the toolbar moves to the next editor.
    $("#toolbar").on('blur', '.last-element', function () {
        Pad.editing.save(); // The toolbar only shows when linked to an editor.
        var index;      // The index to insert the new line at.
        index = Pad.editing.model.collection.indexOf(Pad.editing.model) + 1;
        Pad.editing.model.collection.at(index).edit();
    });

    // Add a new line after, and of the type named by, the toolbar button.
    $("#toolbar").on('click', 'button', function () {
        Pad.editing.save(); // The toolbar only shows when linked to an editor.
        var index;      // The index to insert the new line at.
        index = Pad.editing.model.collection.indexOf(Pad.editing.model) + 1;
        Pad.editing.model.collection.add(
            new LineTypes[this.name].model(),
            {at: index}
        );
        Pad.editing.model.collection.at(index).edit();
    });

    /** The collection of lines that make-up the CalcPad. */
    var Lines;
    Lines = new LineCollection();

    /** Compiled line type templates. */
    //var LineTypes = {}; //loadTypes(LineItem, LineView, DepTree);

    /** The application view of the CalcPad. */
    var Pad;
    Pad = new PadView();

    //window.DepTreeMe = DepTree;

    return Pad;

});