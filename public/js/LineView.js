/**
    Base view for a for a blank line of the calculation.
    @module     LineView
    @requires   underscore
    @requires   Backbone
 */
define(function (require) {
    "use strict";

    /* Libraries */
    var _           = require('underscore'),
        BackBone    = require('backbone');

    /* Templates */
    var tplLine     = require('tpl!lines/blank/line'),
        tplView     = require('tpl!lines/blank/view'),
        tplEdit     = require('tpl!lines/blank/edit');

    var LineView = Backbone.View.extend({
        /**
         * Prototype view of a single Line.
         * @lends LineView.prototype
         */

         /**
          * Element type used to enclose the view.
          * @type {string}
          * @see {@link http://backbonejs.org/#View|Backbone.js}
          * @private
          */
        tagName: "a",

         /**
          * Class applied to enclosing view element.
          * @type {string}
          * @see {@link http://backbonejs.org/#View|Backbone.js}
          * @private
          */
        className: "list-group-item list-group-table",

        messages: [],
        addMessage: function(name, alert, message, dismissable) {
            var thisMessage = {
                name: name,
                alert: alert,
                message: message,
                dismissable: dismissable
            };
            this.messages.push(thisMessage);
            this.render();
        },

         /**
          * Underscore template to be rendered as the line view.
          *
          * The view prototype includes logic to switch between two divs with
          * 'view' and 'edit' classes applied, merging in the .view and .edit
          * micro-templates of the this.templates name space.
          *
          * In most cases it should be enough just to implement this.templates
          * fully.
          *
          * Altering this master template should be undertaken with
          * case, acknowledging the additional responsibilities of manual
          * edit/view toggling behaviour.
          *
          * @type {string}
          * @protected
          */
        template: tplLine,

        templates: {
            view: tplView,
            edit: tplEdit
        },

        /**
         * Events watched by the view.
         *
         * The defaults of the base, LineView, prototype will persist unless
         * specified in the extending lineType definition.
         *
         * Note that overloading the base events will break the default toogle
         * between view and edit.
         *
         * @see {@link http://backbonejs.org/#View-delegateEvents|Backbone.js}
         * @protected
         */
        events: {
            "dblclick .view"            : "edit",
            "focus .edit"               : "focus"
        },

        /** @constructs */
        initialize: function () {
            // Allow lazy line definitions by inheriting prototype defaults.
            _.defaults(this.events, LineView.prototype.events);

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'edit', this.edit);
        },

        /**
         * Called immediately before the view is rendered.
         * @protected
         */
        preRender: function () {},

        /**
         * Renders the line view.
         *
         * The LineView prototype provides two sequence functions to implement:
         * prerender and postrender. These are called either-side of the
         * default appending of this.template.
         *
         * @see {@link http://backbonejs.org/#View-render|Backbone.js}
         * @private
         */
        render: function () {
            this.preRender();
            this.$el.html(this.template(this.model.templateJSON()));
            this.postRender();
            return this;
        },

        /**
         * Called immediately after the view is rendered.
         * @protected
         */
        postRender: function () {},

        preEdit: function () {},
        /**
         * Called when the user requests the editing mode of this line.
         *
         * Following the prototype behaviour, this sets the current view as the
         * editing view on the pad, switches the template to the editor and
         * relocates the toolbar.
         *
         * @private
         */
        edit: function () {
            // Users are not preventing from switching edit focus between lines.
            this.model.collection.trigger("edit", { view: this });
            this.$el.addClass("editing");

            this.preEdit();

            this.$(".first-element").focus().select();
        },

        preSave: function () {},

        /**
         * Called when the editor view is requested to saving.
         *
         * Following the prototype behaviour, this automatically updates model
         * attributes from inputs with the '.model-attribute' class by matching
         * names.
         *
         * This function should be re-implemented when extending into more
         * complex views.
         *
         * @protected
         */
        save: function () {
            this.preSave();
            var viewModel = this.model;
            _.each(this.$(".edit .form-control"),
                function(element, index, list) {
                    if (element.name !== undefined) {
                        viewModel.set(element.name, element.value);
                    }
                }
            );
            this.postSave();
        },

        postSave: function () {},

        /**
         * Called when the editor is to be closed.
         *
         * Following the prototype behaviour, the editor is closed after the
         * user tabs beyond the toolbar, edits another line, or clicks outside
         * of the editor.
         *
         * @param {boolean=} false - Save the model when closing the editor.
         * @private
         */
        close: function (saveAndClose) {
            if (saveAndClose) { this.save(); }
            this.$el.removeClass("editing");
            this.model.collection.trigger("close", { view: this });
        }

    });

    return LineView;

});