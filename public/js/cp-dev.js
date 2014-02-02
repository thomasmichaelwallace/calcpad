/**
 * CalcPad - Development Script Dump
 * Copyright (C) 2014 Thomas Michael Wallace
 * Apache 2 Licensed
 */

// Development script for CalcPad

// This file will ultimately grow into modules, and all that jazz.
// But for now it's just a simple one-page testament to bad programming.

$(function () {

    var math;           // global instance of the math.js library
    var editing;        // global reference to currently editing object.

    var Lines;          // base collection of lines that make-up the pad.

    // Abstract line model.
    var LineItem = Backbone.Model.extend({

        protoValues: {
                id: null,
                lineType: "Blank",
                value: undefined,
                deps: [],
                formula: undefined
        },
        lineValues: {},

        /** **/
        defaults: function () {
            var defaults;   // compiled list of base and partial type defaults
            defaults = {};
            _.extend(defaults, this.protoValues, this.lineValues);
            return defaults;
        },

        initialize: function () {
            if (this.get("formula") === undefined) {
                this.set("formula", "_model(" + this.id + ")");
            }
        },

        calculate: function () {
            var result;     //  the calculated result.
            /* jshint ignore:start */
            result = math.eval(this.get("formula"), this.collection.scope);
            /* jshint ignore:end */
            this.set("value", result);
        },

        view: {}

    });

    // Abstract line view.
    var LineView = Backbone.View.extend({

        tagName: "a",
        className: "list-group-item",

        template: _.template([
            '<div class="view">',
                '<%= this.templates.view(this.model.toJSON()) %>',
            '</div>',
            '<div class="edit">',
                '<%= this.templates.edit(this.model.toJSON()) %>',
            '<div/>'
        ].join('\n')),

        events: {
            "change .scope-value"       : "updateScope",
            "dblclick .view"            : "edit",
            "focus .edit"               : "focus",
            "blur .edit"                : "blur"//,
            //"blur .last-element"      : "blurLast"
        },

        focus: function () {
            if (editing !== undefined && this !== editing) {
                editing.$el.removeClass("editing");
            }
        },
        blur: function () {
        },

        blurLast: function () {
            var index;  // location of view within collection.
            this.saveAndClose();
            index = this.model.collection.indexOf(this.model);
            this.model.collection.at(index + 1).view.edit();
        },

        saveAndClose: function () {
            _.each(this.$(".edit .form-control"),
                    function(element, index, list) {
                if (element.name !== undefined) {
                    editing.model.set(element.name, element.value);
                }
            });
            editing = undefined;
            this.$el.removeClass("editing");
            $("#toolbar").removeClass("toolbar-on");
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        prerender: function () {},
        render: function () {
            this.prerender();
            this.$el.html(this.template(this.model.toJSON()));
            this.postrender();
            return this;
        },
        postrender: function () {},

        updateScope: function () {
            this.model.set("value", parseFloat(this.$('.scope-value').val()));
            this.model.collection.calculate([this.model.id]);
        },

        edit: function () {
            if (editing !== undefined) {
                editing.$el.removeClass("editing");
            }
            this.$el.addClass("editing");
            this.$(".first-element").focus().select();
            editing = this;
            // locate toolbar
            $("#toolbar").detach().insertAfter(this.$el);
            $("#toolbar").addClass("toolbar-on");
        },

    });

    // Collection of lines forming a single pad.
    var LineCollection = Backbone.Collection.extend({

        model: function (attrs, options) {
            var type;   // actual linetype of the model
            type = attrs.lineType;
            if (type in lineTypes) {
                return new lineTypes[type].model(attrs, options);
            } else {
                return new LineItem(attrs, options);
            }
        },

        url: 'json/beam.json',

        scope: {
            _model: function(id) {
                return Lines.get(id).get("value");
            }
        },
        depTree: [],

        setScopes: function() {
            var col;        // current collection
            col = this;
            _.each(this.models, function(element, index, list) {
                var deps;   // dependencies of current model.
                deps = element.get("deps");
                if (deps !== undefined) {
                    _.each(deps, function(delement, dindex, dlist) {
                        col.modelScopes[delement] = element;
                    });
                }
            });
            _.each(this.modelScopes, function(value, key, list) {
                value.calculate();
            });
        },

        updateScopes: function(scope) {
            if (scope in this.modelScopes) {
                this.modelScopes[scope].calculate();
            }
        },

        calculate: function(dirty) {
            _.each(this.depTree, function(element, index, list) {
                var line;   // current line model.
                line = Lines.get(element);
                if (dirty !== undefined) {
                    _.each(line.get("deps"), function(element, index, list) {
                        if (_.contains(dirty, element)) {
                            line.calculate();
                            dirty.push(line.id);
                        }
                    });
                } else {
                    line.calculate();
                }
            });
        },

        edges: [],

        addEdges: function(line) {
            var self;       // reference back to the current collection.
            var edge;       // id of the edge formed.
            self = this;
            edge = line.id;
            if (line.get("deps").length > 0) {
                _.each(line.get("deps"), function(element, index, list) {
                    self.edges.push([element, edge]);
                });
            }
        },
        removeEdges: function(id) {
            this.edges = _.each(this.edges, function(element) {
                return element[1] == id;
            });
        },
        buildTree: function() {
            this.depTree = tsort(this.edges);
        }


    });

    Lines = new LineCollection();


    // CalcPad Application view
    var PadView = Backbone.View.extend({

        el: $(".container"),

        initialize: function() {
            this.listenTo(Lines, 'add', this.addOne);
            this.listenTo(Lines, 'reset', this.addAll);
            this.listenTo(Lines, 'all', this.render);

            Lines.fetch({
                success: function(model, response) {
                    Lines.buildTree();
                    Lines.calculate();
                }
            });
        },

        addOne: function(line, collection, options) {
            var type = line.get('lineType');
            if (type in lineTypes) {
                line.view = new lineTypes[type].view({ model: line });
            } else {
                line.view = new LineView({ model: line });
            }
            if (options !== undefined && "at" in options) {
                this.$('#pad a:nth-child(' + options.at + ')')
                        .after(line.view.render().el);
            } else {
                this.$("#pad").append(line.view.render().el);
            }

            Lines.addEdges(line);
        },

        addAll: function() {
            console.log("addAll");
        },
    });

    math = mathjs();
    var lineTypes = loadTypes(LineItem, LineView);
    var Pad = new PadView();

    // Both this Shin's incrediablly useful topological sort algorthim,
    // until I get a chance to write my own.

    /**
    * general topological sort
    * @author SHIN Suzuki (shinout310@gmail.com)
    * @param Array<Array> edges : list of edges. each edge forms Array<ID,ID>
    *   e.g. [12 , 3]
    *
    * @returns Array : topological sorted list of IDs
    **/

    function tsort(edges) {
        var nodes = {}, // hash: stringified id of the node => { id: id,
                        // afters: lisf of ids }
        sorted = [], // sorted list of IDs ( returned value )
        visited = {}; // hash: id of already visited node => true

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

    $("div").on('mousedown', ".view", function (){
        if (editing !== undefined) {
            editing.saveAndClose();
        }
        return false;
    });
    $("div").on('mousedown', ".edit", function (){
        return false;
    });
    $("div").on('mousedown', "#toolbar", function (){
        return false;
    });
    $('body').on('mousedown', null, function () {
        if (editing !== undefined) {
            editing.saveAndClose();
        }
        return false;
    });
    $("#pad").on('click', 'input', function () {
        $(this).select();
    });
    $("#pad").on('focus', 'input', function () {
        $(this).select();
    });
    $("#toolbar").on('blur', '.last-element', function () {
        editing.blurLast();
    });
    $("#toolbar").on('click', 'button', function () {
        var index;  // index at insert the new line type.

        index = editing.model.collection.indexOf(editing.model) + 1;
        editing.model.collection.add(
            new lineTypes[this.name].model(),
            {at: index}
        );
        editing.blurLast();
    });

});