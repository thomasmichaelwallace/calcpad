/**
    Static image line-type.
    @module     lines/image/image
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /* Templates */
    var tplView     = require('tpl!lines/image/view'),
        tplEdit     = require('tpl!lines/blank/edit');

    /**
     * Static image line-type.
     * @exports lines/image/image
     */
    var image = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new title.
             * @property {string} defaults.source - The url of the image source.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType:   "Image",
                source:     ""
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
        toolbar: undefined
    };
    return image;
});