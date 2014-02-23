/**
    Section title line-type.
    @module     lines/sectiontitle/sectiontitle
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /* Templates */
    var tplView     = require('tpl!lines/sectiontitle/view'),
        tplEdit     = require('tpl!lines/sectiontitle/edit'),
        tplTool     = require('text!lines/sectiontitle/tool.html');

    /**
     * Section title line-type.
     * @exports lines/sectiontitle/sectiontitle
     */
    var sectiontitle = {

        /* Model extensions. */
        model: LineModel.extend({
            /** @lends LineModel.prototype */

            /**
             * Default values for a new section title.
             * @property {string} defaults.text - The section title.
             * @lends LineModel.defaults
             */
            defaults: {
                lineType:   "SectionTitle",
                text:       "New Section"
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
    return sectiontitle;
});