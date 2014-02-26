/**
    A collection of lines forming a single calculation.
    @module     LineItem
    @requires   Backbone
 */
define([
    "underscore", "backbone", "LineTypes", "DepTree", "LineModel"
], function(
    _, BackBone, lineTypes, DepTree, LineItem
) {

    var LineCollection = Backbone.Collection.extend({
        /**
         * Prototype of a collection of lines forming a single pad.
         * @lends LineCollection.prototype
         */

         depTree: DepTree,

        /**
         * The CalcServer URL.
         *
         * Currently this is a flat JSON file while CalcServer is developed.
         *
         * @type {string}
         * @see {@link http://backbonejs.org/#Collection-url|Backbone.js}
         */
        url: 'json/concrete.json',

        /**
         * Provide polymorphic assignment between different types of lines using
         * the model.lineType attribute and matching it against the defined
         * line types.
         *
         * @param {object} attrs    - List of attributes.
         * @param {object} options  - List of options.
         * @see {@link http://backbonejs.org/#Collection-model|Backbone.js}
         * @private
         */
        model: function (attrs, options) {
            var type;
            type = attrs.lineType;
            if (type !== undefined && type in lineTypes) {
                return new lineTypes[type].model(attrs, options);
            } else {
                // The default implementation indicates a 404 for the view.
                return new LineItem(attrs, options);
            }
        },

        /**
         * Causes all relevant lines in the pad to re-calculate following the
         * update of a set of values.
         *
         * @param {Array.number} dirty - Line cids that have changed.
         * @public
         */
        calculate: function(dirty) {
            var collection;
            collection = this;
            // Walk the topologically sorted tree for efficient re-calcuation.
            _.each(collection.depTree.order, function(sid) {
                var cid = collection.depTree.getTokenCid(sid);
                var line;
                line = collection.get(cid);
                if (line === undefined) { console.log(cid); }
                if (line !== undefined) {
                    line.calculate();
                }
            });
        }

    });

    return LineCollection;

});