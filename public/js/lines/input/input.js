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

            sid: null,

            setup: function() {
                this.collection.depTree.registerToken(
                    this.cid,
                    this.get("symbol"),
                    this.get("state")
                );
            },

            load: function() {
                this.on("add", this.setup);
            }

        }),

        /* View extensions. */
        view: LineView.extend({

            templates: {
                view: tplView,
                edit: tplEdit
            },

            postRender: function() {
                console.log(this.el);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
            }

        }),

        /* Toolbar item. */
        toolbar: tplTool

    };
    return input;
});