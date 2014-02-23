/**
    Blank line-type.
    @module     lines/blank/blank
    @requires   LineModel
    @requires   LineView
 */
define(function (require) {
    "use strict";

    /* Base objects */
    var LineModel   = require('LineModel'),
        LineView    = require('LineView');

    /**
     * Blank line-type.
     * @exports lines/blank/blank
     */
    var blank = {

        /* Model extensions. */
        model: LineModel,

        /* View extensions. */
        view: LineView,

        /* Toolbar item. */
        toolbar: undefined

    };
    return blank;
});