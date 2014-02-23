/**
 * CalcPad - Line Type Definitions
 * Copyright (C) 2014 Thomas Michael Wallace
 * Apache 2 Licensed
 */

// Line type definitions for CalcPad.

// This is not correctly modular at the moment, but it clears the dev.evelopment pad.
define(function (require) {
    "use strict";

    var blank =         require('lines/blank/blank'),
        image =         require('lines/image/image'),
        input =         require('lines/input/input'),
        paragraph =     require('lines/paragraph/paragraph'),
        sectiontitle =  require('lines/sectiontitle/sectiontitle'),
        title =         require('lines/title/title')
        ;

    var linetypes = {

        Blank:          blank,
        Image:          image,
        Input:          input,
        Paragraph:      paragraph,
        SectionTitle:   sectiontitle,
        Title:          title

    };

    return linetypes;
});