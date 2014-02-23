/**
    Base functionality for a blank line of the calculation.
    @module     LineModel
    @requires   underscore
    @requires   BackBone
 */
define(function (require) {
    "use strict";

    /* Libraries */
    var _           = require('underscore'),
        BackBone    = require('backbone');

	var LineItem = Backbone.Model.extend({
        /**
         * Prototype functionality of a single Line.
         * @lends LineItem.prototype
         */

        /** @constructs */
        initialize: function () {
            // Allow lazy line definitions by inheriting prototype defaults.
            _.defaults(this.defaults, LineItem.prototype.defaults);
            this.load();
        },

        /**
         * Called when a model is loaded from a file
         */
        load: function () {},

        /**
         * Default values given to new, or incomplete, lines.
         *
         * The defaults of the base, LineItem, prototype will persist unless
         * specified in the extending lineType definition.
         *
         * @property {string} "Blank"   - The type of line.
         */
        defaults: {
            lineType: "Blank",
            leftMargin: "",
            rightMargin: "",
            comments: []
        },

        /**
         * Convert to JSON with evaluated value for view templating.
         * @return {object}
         */
        templateJSON: function () {
            var json = {};
            _.extend(json, this.toJSON(), this.templateAttributes());
            return json;
        },

        /**
         * Model specific attributes exposed to the view.
         * @property {string} formattedText - Body text parsed as HTML.
         */
        templateAttributes: function() {
            return { value: this.value };
        },

        /**
         * Evaluated value of the line.
         * @type {number}
         * @private
         */
        value: undefined,

        /**
         * Client ids of lines this line is dependent upon.
         * @type {Array.<number>}
         * @protected
         */
        dependents: [],

        /**
         * Causes the value of the model to be re-evaluated.
         * @public
         */
        calculate: function () {
            this.updateValue(this.expression());
        },

        /**
         * Function used to evaluate the current value of this line.
         * @return {number} - Evaluated value.
         * @protected
         */
        expression: function() {
            return this.value;
        },

        /**
         * Updates the evaluated value of the model.
         * @private
         * @param {number} data - value to set line to.
         * @fires Backbone.Model#change
         */
        updateValue: function (data) {
            this.value = data;
            this.trigger("change", this);
        },

        /**
         * Switches the model into editing mode.
         */
        edit: function() {
            this.trigger("edit", this);
        }

    });

	return LineItem;

});