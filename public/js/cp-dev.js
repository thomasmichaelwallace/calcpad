/**
 * CalcPad
 * https://github.com/thomasmichaelwallace/calcpad
 *
 * CalcPad is a web application for writing engineering calculations.
 * It provides an extensable library of 'lines' that can be used to form
 * even complex calculations from an easy to use graphical interface.
 *
 * Currently CalcPad is under preliminary development; so hope for great
 * things, even if they're not here yet!
 *
 * @author      thomas michael wallace <thomasmichaelwallace@googlemail.com>
 * @version     0.1.0
 * @date        2014-01-18
 * @copyright   Thomas Michael Wallace 2013-2014
 *
 * @license
 * Copyright (C) 2014 thomas michael wallace <thomasmichaelwallace@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
    CalcPad application instance.
    @module     CalcPad
    @requires   Backbone
    @requires   mathjs
    @requires   MathJax
*/
$(function () {

    var LineItem = Backbone.Model.extend({
        /**
         * Prototype functionality of a single Line.
         * @lends LineItem.prototype
         */

        /**
         * Default values given to new, or incomplete, lines.
         *
         * The defaults of the base, LineItem, prototype will persist unless
         * specified in the extending lineType definition.
         *
         * @property {string} null      - Symbol representing the value of this line.
         * @property {string} "Blank"   - The type of line.
         */
        defaults: {
            lineType: "Blank",
            symbol: null,
            savedValue: null
        },

        /**
         * Evaluated value of the line.
         * @type {number}
         * @private
         */
        value: null,

        /**
         * Function used to evaluate the current value of this line.
         * @return {number} - Evaluated value.
         * @protected
         */
        expression: function() {
            return this.value;
        },

        /**
         * Client ids of lines this line is dependent upon.
         * @type {Array.<number>}
         * @protected
         */
        dependents: [],
        setDeps: function () {},

        /** @constructs */
        initialize: function () {
            // Allow lazy line definitions by inheriting prototype defaults.
            _.defaults(this.defaults, LineItem.prototype.defaults);
            this.load();
        },

        /**
         * Called when a model is loaded from a file
         */
        load: function () {},

        /**
         * Convert to JSON with evaluated value for view templating.
         * @return {object}
         */
        templateJSON: function () {
            var json = {};
            _.extend(json, this.toJSON(), { value: this.value });
            return json;
        },

        /**
         * Causes the value of the model to be re-evaluated.
         * @public
         */
        calculate: function () {
            console.log("calc_local");
            this.updateValue(this.expression());
        },

        /**
         * Updates the evaluated value of the model.
         * @private
         * @param {number} data - value to set line to.
         * @fires Backbone.Model#change
         */
        updateValue: function (data) {
            this.value = data;
            this.trigger("change", this);
        },

        /**
         * Switches the model into editing mode.
         */
        edit: function() {
            this.trigger("edit", this);
        }

    });


    var LineView = Backbone.View.extend({
        /**
         * Prototype view of a single Line.
         * @lends LineView.prototype
         */

         /**
          * Element type used to enclose the view.
          * @type {string}
          * @see {@link http://backbonejs.org/#View|Backbone.js}
          * @private
          */
        tagName: "a",

         /**
          * Class applied to enclosing view element.
          * @type {string}
          * @see {@link http://backbonejs.org/#View|Backbone.js}
          * @private
          */
        className: "list-group-item",

         /**
          * Underscore template to be rendered as the line view.
          *
          * The view prototype includes logic to switch between two divs with
          * 'view' and 'edit' classes applied, merging in the .view and .edit
          * micro-templates of the this.templates name space.
          *
          * In most cases it should be enough just to implement this.templates
          * fully.
          *
          * Altering this master template should be undertaken with
          * case, acknowledging the additional responsibilities of manual
          * edit/view toggling behaviour.
          *
          * @type {string}
          * @protected
          */
        template: _.template([
            '<div class="view">',
                '<%= this.templates.view(this.model.templateJSON()) %>',
            '</div>',
            '<div class="edit">',
                '<%= this.templates.edit(this.model.templateJSON()) %>',
            '</div>'
        ].join('\n')),

        templates: {
            view: _.template(
                '<p class="text-danger">Error: Missing template.</p></div>'
                ),
            edit: _.template(
                '<p>Error: Missing editor.</p>'
                )
        },

        /**
         * Events watched by the view.
         *
         * The defaults of the base, LineView, prototype will persist unless
         * specified in the extending lineType definition.
         *
         * Note that overloading the base events will break the default toogle
         * between view and edit.
         *
         * @see {@link http://backbonejs.org/#View-delegateEvents|Backbone.js}
         * @protected
         */
        events: {
            "dblclick .view"            : "edit",
            "focus .edit"               : "focus"
        },

        /** @constructs */
        initialize: function () {
            // Allow lazy line definitions by inheriting prototype defaults.
            _.defaults(this.events, LineView.prototype.events);

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'edit', this.edit);
        },

        /**
         * Called immediately before the view is rendered.
         * @protected
         */
        preRender: function () {},

        /**
         * Renders the line view.
         *
         * The LineView prototype provides two sequence functions to implement:
         * prerender and postrender. These are called either-side of the
         * default appending of this.template.
         *
         * @see {@link http://backbonejs.org/#View-render|Backbone.js}
         * @private
         */
        render: function () {
            this.preRender();
            this.$el.html(this.template(this.model.templateJSON()));
            this.postRender();
            return this;
        },

        /**
         * Called immediately after the view is rendered.
         * @protected
         */
        postRender: function () {},

        preEdit: function () {},
        /**
         * Called when the user requests the editing mode of this line.
         *
         * Following the prototype behaviour, this sets the current view as the
         * editing view on the pad, switches the template to the editor and
         * relocates the toolbar.
         *
         * @private
         */
        edit: function () {
            // Users are not preventing from switching edit focus between lines.
            if (Pad.editing !== undefined) {
                Pad.editing.$el.removeClass("editing");
            }
            Pad.editing = this;
            this.$el.addClass("editing");

            this.preEdit();

            this.$(".first-element").focus().select();

            // Relocate the toolbar.
            $("#toolbar").detach().insertAfter(this.$el);
            $("#toolbar").addClass("toolbar-on");
        },

        preSave: function () {},
        /**
         * Called when the editor view is requested to saving.
         *
         * Following the prototype behaviour, this automatically updates model
         * attributes from inputs with the '.model-attribute' class by matching
         * names.
         *
         * This function should be re-implemented when extending into more
         * complex views.
         *
         * @protected
         */
        save: function () {
            this.preSave();
            _.each(this.$(".edit .form-control"),
                    function(element, index, list) {
                if (element.name !== undefined) {
                    Pad.editing.model.set(element.name, element.value);
                }
            });
            this.postSave();
        },
        postSave: function () {},

        /**
         * Called when the editor is to be closed.
         *
         * Following the prototype behaviour, the editor is closed after the
         * user tabs beyond the toolbar, edits another line, or clicks outside
         * of the editor.
         *
         * @param {boolean=} false - Save the model when closing the editor.
         * @private
         */
        close: function (saveAndClose) {
            if (saveAndClose) { this.save(); }
            Pad.editing = undefined;
            this.$el.removeClass("editing");
            $("#toolbar").removeClass("toolbar-on");
        }

    });

    var LineCollection = Backbone.Collection.extend({
        /**
         * Prototype of a collection of lines forming a single pad.
         * @lends LineCollection.prototype
         */

        /**
         * The CalcServer URL.
         *
         * Currently this is a flat JSON file while CalcServer is developed.
         *
         * @type {string}
         * @see {@link http://backbonejs.org/#Collection-url|Backbone.js}
         */
        url: 'json/beam.json',

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
            console.log("calc");
            var collection;
            collection = this;

            // Walk the topologically sorted tree for efficient re-calcuation.
            _.each(DepTree.order, function(cid) {
                var line;
                line = collection.get(cid);

                console.log("Walking...");
                console.log(cid);
                console.log(dirty);
                if (dirty !== undefined) {

                    if (_.contains(dirty, line.id)) {
                        // Update values in the tree from the dirty set.
                        line.calculate();
                    }

                    _.each(line.dependents, function(dependent) {
                        var did = DepTree.symbolMap[dependent];
                        if (_.contains(dirty, did)) {
                            // Once these are updated they are, too, dirty.
                            dirty.push(line.id);
                            line.calculate();
                        }
                    });

                } else {
                    // Without a subset of updated values, calculate every line.
                    line.calculate();
                }
            });
        },

        scope: {
            _model: function(symbol) {
                return Lines.get(DepTree.symbolMap[symbol]).value;
            }
        }

    });

    var PadView = Backbone.View.extend({
        /**
         * Prototype view of the lines collection, forming a coherent pad.
         * @lends PadView.prototype
         */

        /**
         * Shared reference to the line currently being edited.
         * @private
         */
        editing: undefined,

        /**
         * The containing element of the whole calculation pad.
         *
         * @see {@link http://backbonejs.org/#View-el|Backbone.js}
         * @private
         */
        el: $(".container"),

        /** @constructs */
        initialize: function() {
            this.buildToolbar();

            this.listenTo(Lines, 'add', this.add);

            Lines.fetch({
                success: function(model, response) {
                    // Build the update order for the first time.
                    _.each(Lines.models, function(element, index, list) {
                        DepTree.addSymbol(element);
                    });
                    _.each(Lines.models, function(element, index, list) {
                        element.setDeps(); //.bind(element);
                        DepTree.addDependents(element);
                    });
                    DepTree.sort();
                    Lines.calculate();
                }
            });
        },

        /**
         * Build the toolbar from the imported line types.
         *
         * @private
         */
        buildToolbar: function() {
            var first=" last-element";  // Only applied to the first button.
            _.each(lineTypes, function(element, index, list) {
                if (element.toolbar !== undefined) {
                    this.$("#toolbar-menu").append([
                        '<button type="button" name="' + index + '"',
                        ' class="btn btn-default navbar-btn' + first + '">',
                            element.toolbar,
                        '</button>'
                    ].join('\n'));
                    first="";
                }
            });
        },

        /**
         * Append a new line view when a new line item is added.
         *
         * @see {@link http://backbonejs.org/#Collection-add|Backbone.js}
         * @private
         */
        add: function(line, collection, options) {
            var view;
            if (line.get("lineType") in lineTypes) {
                view = new lineTypes[line.get("lineType")].view({ model: line });
            } else {
                view = new LineView({ model: line });
            }
            if (options !== undefined && "at" in options) {
                // Lines added with the toolbar are done so with position.
                this.$('#pad a:nth-child(' + options.at + ')')
                        .after(view.render().el);
            } else {
                // During fetch lines are just appended to the end.
                this.$("#pad").append(view.render().el);
            }
        }

    });

    // Stop click propegation in an editor.
    $("div").on('mousedown', ".edit", function (){
        return false;
    });
    // Stop click propegation in the toolbar.
    $("div").on('mousedown', "#toolbar", function (){
        return false;
    });
    // Clicking on another view closes the editor, saving changes.
    $("div").on('mousedown', ".view", function (){
        if (Pad.editing !== undefined) {
            Pad.editing.close(true);
            return false;
        }
    });
    // Clicking outside the calculation closes the editor, saving changes.
    $('body').on('mousedown', null, function () {
        if (Pad.editing !== undefined) {
            Pad.editing.close(true);
            return false;
        }
    });
    // Pressing enter closes the editor, saving changes.
    $("div").on('keypress', ".edit", function (e) {
        if (e.keyCode != 13) return;
        if (Pad.editing !== undefined) {
            Pad.editing.close(true);
        }
    });

    // Automatically select all the text in an input box.
    $("#pad").on('click', 'input', function () {
        $(this).select();
    });
    $("#pad").on('focus', 'input', function () {
        $(this).select();
    });

    // Tabing from the toolbar moves to the next editor.
    $("#toolbar").on('blur', '.last-element', function () {
        Pad.editing.save(); // The toolbar only shows when linked to an editor.
        var index;      // The index to insert the new line at.
        index = Pad.editing.model.collection.indexOf(Pad.editing.model) + 1;
        Pad.editing.model.collection.at(index).edit();
    });

    // Add a new line after, and of the type named by, the toolbar button.
    $("#toolbar").on('click', 'button', function () {
        Pad.editing.save(); // The toolbar only shows when linked to an editor.
        var index;      // The index to insert the new line at.
        index = Pad.editing.model.collection.indexOf(Pad.editing.model) + 1;
        Pad.editing.model.collection.add(
            new lineTypes[this.name].model(),
            {at: index}
        );
        Pad.editing.model.collection.at(index).edit();
    });


    /**
     * Manager for the order that values are re-calculated.
     *
     * @namespace
     * @private
     */
    var DepTree = {

        symbolMap: {},

        addSymbol: function(line) {
            var symbol = line.get("symbol");
            if (symbol === undefined || symbol === null ) { return; }
            this.symbolMap[symbol] = line.id;
        },

        removeSymbol: function(symbol) {
            this.symbolMap[symbol] = undefined;
        },

        /**
         * Topologically sorted list defining the optimal order the values
         * should be (re-)calculated.
         *
         * @type {Array.number}
         * @public
         */
        order: [],

        /**
         * DAG edges of the pad line dependencies.
         *
         * @type {Array.Array}
         * @private
         */
        edges: [],

        /**
         * Add all the dependents of a line to the tree.
         *
         * @param {Object} line - Line to add dependents of.
         * @public
         */
        addDependents: function(line) {
            var self;       // reference back to the current collection.
            var edge;       // id of the edge formed.
            self = this;
            edge = line.id;
            if (line.dependents.length > 0) {
                _.each(line.dependents, function(element, index, list) {
                    var mid = self.symbolMap[element];
                    self.edges.push([mid, edge]);
                });
            }
            this.sort();
        },

        /**
         * Remove all the dependents of a line from the tree.
         *
         * @param {Object} line - Line to remove dependents of.
         * @public
         */
        removeDependents: function(line) {
            this.edges = _.filter(this.edges, function(element) {
                return element[1] != line.id;
            });
            this.sort();
        },

        /**
         * Re-sort the update tree from the DAG of edges.
         *
         * This must be called when edges changes to keep the calculation
         * order current.
         *
         * @private
         */
        sort: function() {
            // Employ Shin Suzuki's topolgical sort implementation for now.
            this.order = this.tsort(this.edges);
        },

        // Use Shin's incrediablly useful topological sort implementaiton...,
        // ... until I get a chance to write my own!

        /**
        * general topological sort
        * @author SHIN Suzuki (shinout310@gmail.com)
        * @param Array<Array> edges : list of edges. each edge forms Array<ID,ID>
        *   e.g. [12 , 3]
        *
        * @returns Array : topological sorted list of IDs
        **/
        tsort: function (edges) {
            var nodes = {}, // hash: stringified id of the node => { id: id,
                            //  afters: list of ids }
            sorted = [],    // sorted list of IDs ( returned value )
            visited = {};   // hash: id of already visited node => true

            var Node = function(id) {
                this.id = id;
                this.afters = [];
            };

            // 1. build data structures
            edges.forEach(function(v) {
                var from = v[0], to = v[1];
                if (!nodes[from]) nodes[from] = new Node(from);
                if (!nodes[to]) nodes[to] = new Node(to);
                nodes[from].afters.push(to);
            });

            // 2. topological sort
            Object.keys(nodes).forEach(function visit(idstr, ancestors) {
                var node = nodes[idstr],
                id = node.id;

                // if already exists, do nothing
                if (visited[idstr]) return;
                if (!Array.isArray(ancestors)) ancestors = [];
                ancestors.push(id);
                visited[idstr] = true;

                node.afters.forEach(function(afterID) {
                    if (ancestors.indexOf(afterID) >= 0) // if already in ancestors,
                                                         // a closed chain exists.
                        throw new Error(
                                'closed chain : ' + afterID + ' is in ' + id
                                );

                    visit(afterID.toString(), ancestors.map(function(v) {
                            return v;
                        })); // recursive call
                });

                sorted.unshift(id);
            });

            return sorted;
        }
    };

    /** The collection of lines that make-up the CalcPad. */
    var Lines;
    Lines = new LineCollection();

    /** Compiled line type templates. */
    var lineTypes = loadTypes(LineItem, LineView, DepTree);

    /** The application view of the CalcPad. */
    var Pad;
    Pad = new PadView();

    window.DepTreeMe = DepTree;

});