/**
    Paragraph line-type.
    @module     lines/paragraph/paragraph
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /* Templates */
    var tplView     = require('tpl!lines/paragraph/view'),
        tplEdit     = require('tpl!lines/paragraph/edit'),
        tplTool     = require('text!lines/paragraph/tool.html');

    /**
     * Paragraph line-type.
     * @exports lines/paragraph/paragraph
     */
    var paragraph = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new paragraph.
             * @property {string} defaults.text - The paragraph body text.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType:   "Paragraph",
                text:       "A new paragraph."
            },

            /**
             * Model specific attributes exposed to the view.
             * @property {string} formattedText - Body text parsed as HTML.
             */
            templateAttributes: function () {
                var formattedText = this.get('text').replace(/\\n/g, '<p></p>');
                return {
                    value: this.value,
                    formattedText: formattedText
                };
            }

        }),

        /* View extensions. */
        view: LineView.extend({
            templates: {
                view: tplView,
                edit: tplEdit
            }
        }),

        /* Toolbar item. */
        toolbar: tplTool

    };
    return paragraph;
});