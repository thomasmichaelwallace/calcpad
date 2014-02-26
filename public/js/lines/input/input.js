/**
    Simple input for a parameter.
    @module     lines/input/input
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Libraries */
    var MathJax     = require('mathjax');

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /* Templates */
    var tplView     = require('tpl!lines/input/view'),
        tplEdit     = require('tpl!lines/input/edit'),
        tplTool     = require('text!lines/input/tool.html');

    /**
     * Simple input for a parameter.
     * @exports lines/input/input
     */
    var input = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new title.
             * @property {string} defaults.symbol - The parameter symbol.
             * @property {string} defaults.description - Parameter description.
             * @property {string} defaults.unit - Parameter calculation unit.
             * @property {string} defaults.savedValue - Previous value.
             * @property {string} deafults.state - State-scope of the parameter.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType: "Input",
                symbol: "i",
                description: "New Parameter",
                unit: "kN",
                savedValue: 0,
                state: 0
            },

            /**
             * Symbol library ID for this parameter.
             */
            sid: null,

            /**
             * Re-registers the symbol after import.
             */
            import: function() {
                this.value = this.get("savedValue");
                this.sid = this.collection.depTree.registerToken(
                    this.cid,
                    this.get("symbol"),
                    this.get("state")
                );
            },

            /**
             * Sets the parameter to the last saved, or default. value.
             */
            load: function() {
                this.value = this.get("savedValue");
            }

        }),

        /* View extensions. */
        view: LineView.extend({
            templates: {
                view: tplView,
                edit: tplEdit
            },

            /**
             * Respond to changes in the scope value.
             * @lends LineView.events
             */
            events: {
                "change .scope-value"       : "updateScope"
            },

            /**
             * Updates the value of the parameter from the input.
             */
            updateScope: function() {
                var value = parseFloat(this.$('.scope-value').val());
                this.model.updateValue(value);
                this.model.collection.calculate([this.model.cid]);
            },

            /**
             * Updates the cached symbol from the master library before rendering.
             */
            preRender: function() {
                if (this.sid !== undefined) {
                    this.model.set("symbol", this.model.collection.depTree.symbols[this.model.sid]);
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
    return input;
});