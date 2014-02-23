/**
    Top-level title line-type.
    @module     lines/title/title
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /* Templates */
    var tplView     = require('tpl!lines/title/view'),
        tplEdit     = require('tpl!lines/title/edit'),
        tplTool     = require('text!lines/title/tool.html');

    /**
     * Top-level title line-type.
     * @exports lines/title/title
     */
    var title = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new title.
             * @property {string} defaults.text - The title text.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType:   "Title",
                text:       "New Title"
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
    return title;
});