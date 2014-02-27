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
        condition =     require('lines/condition/condition'),
        image =         require('lines/image/image'),
        formula =       require('lines/formula/formula'),
        input =         require('lines/input/input'),
        paragraph =     require('lines/paragraph/paragraph'),
        sectiontitle =  require('lines/sectiontitle/sectiontitle'),
        title =         require('lines/title/title')
        ;

    var linetypes = {

        Blank:          blank,
        Condition:      condition,
        Image:          image,
        Formula:        formula,
        Input:          input,
        Paragraph:      paragraph,
        SectionTitle:   sectiontitle,
        Title:          title

    };

    return linetypes;
});