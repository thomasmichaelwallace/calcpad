/**
    Calculation domain manager.
    @module     DepTree
    @requires   underscore
 */

define(function (require) {
    "use strict";

    var _   = require('underscore');

    /**
     * Manager for the order that values are re-calculated.
     *
     * @namespace
     * @private
     */
    var depTree = {

        tokens: {},

        allocSid: 0,

        nextSid: function() {
            this.allocSid += 1;
            return this.allocSid;
        },

        registerToken: function(cid, symbol, state) {
            // check and extend.

            var sid = this.getSid(symbol);

            if (sid === undefined) {
                sid = this.nextSid();
                this.tokens[sid] = {
                    sid: sid,
                    state: 0,
                    symbol: symbol,
                    states: {}
                };
                this.symbols[symbol] = sid;
                this.tokens[sid].states[state] = cid;
                return sid;

            } else {

                if (state in this.tokens[sid].states) {
                    console.log(symbol);
                    console.log(cid);
                    throw ("token/state exists!");
                } else {
                    this.tokens[sid].states[state] = cid;
                    return sid;
                }

            }

        },

        /**
         * Add all the dependents of a line to the tree.
         *
         * @param {Object} line - Line to add dependents of.
         * @public
         */
        registerDependents: function(sid, depSids) {
            var self;       // reference back to the current collection.
            var edge;       // id of the edge formed.
            self = this;
            edge = sid;

            _.each(depSids, function(depSid) {
                self.edges.push([depSid, edge]);
            });

            this.sort();
        },

        symbols: {},

        getTokenCid: function(sid) {
            // sync with states.
            if (sid in this.tokens) {
                var token = this.tokens[sid];
                var state;
                var self = this;
                _.each(self.onStates, function(element, index, item) {
                    if (element in token.states) {
                        console.log(element);
                        state = element;
                    }
                });
                token.state = state;
                return token.states[token.state];
            }
            return undefined;
        },

        getSid: function(symbol) {
            var self = this;
            var sids = _.keys(self.tokens);
            return _.find(sids, function(key) {
                return self.tokens[key].symbol === symbol;
            });
        },

        unregisterToken: function(symbol, state) {
            // check
        },

        symbolMap: {},

        addSymbol: function(line) {

            var symbol = line.get("symbol");
            if (symbol === undefined || symbol === null ) { return; }

            var state = line.get("state");
            if (state === undefined || state === null) { state = "0"; }


            if (symbol in this.symbolMap) {
                var map = this.symbolMap[symbol];
                map[state] = line.cid;
            } else {
                this.symbolMap[symbol] = {};
                this.symbolMap[symbol][state] = line.cid;
            }

        },

        removeSymbol: function(line) {
            var symbol = line.get("symbol");
            if (symbol === undefined || symbol === null ) { return; }

            var state = line.get("state");
            if (state === undefined || state === null) { state = "0"; }


            if (symbol in this.symbolMap) {
                var map = this.symbolMap[symbol];
                if (state in map) {
                    delete map[state];
                    if (_.keys(map).length === 0) {
                        delete this.symbolMap[symbol];
                    }
                }
            }
        },

        getAllFromSymbol: function(symbol) {
            var all = [];
            _.each(this.symbolMap[symbol], function(line) {
                all.push(line);
            });
            return all;
        },

        getBySymbol: function(symbol) {
            var map = this.symbolMap[symbol];
            var state;
            for (var i = this.onStates.length - 1; i >= 0; i--) {
                state = this.onStates[i];
                if (state in map) { break; }
            }
            var line = 1; //Lines.get(this.symbolMap[symbol][state]);
            return line;
        },

        states: {},
        onStates: [0],

        switchState: function(state, on) {
            var index = _.indexOf(this.onStates, state);
            if (!on && index > -1) {
                this.onStates.splice(index, 1);
            }
            if (on && index == -1) {
                this.onStates.push(state);
            }
        },

        addState: function(line) {
            var state = line.get("condition");
            if (state === undefined || state === null ) { return; }
            this.states[state] = line.cid;
        },

        removeState: function(line) {

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
            edge = line.cid;
            if (line.dependents.length == 1 && line.dependents[0] === null) {
                self.edges.push([-1, edge]);
            } else if (line.dependents.length > 0) {
                _.each(line.dependents, function(element, index, list) {
                    var sids = DepTree.getAllFromSymbol(element);
                    for (var i = sids.length - 1; i >= 0; i--) {
                        var mid = sids[i];
                        if (mid === undefined) {
                        }
                        self.edges.push([mid, edge]);
                    }
                });
            }

            var stateDep = line.get("state");
            if (stateDep !== undefined && stateDep !== null) {
                _.each(_.keys(this.symbolMap[line.get("symbol")]), function(no) {
                    if (no != 0) {
                        var sid = self.states[no];
                        if (sid === undefined) {
                        }
                        self.edges.push([sid, edge]);
                    }
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
                return element[1] != line.cid;
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
            var sorted = this.tsort(this.edges);
            this.order = _.reject(sorted, function(cid) { return cid == -1; }) ;
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

    return depTree;
});