// Development script for CalcPad

// This file will ultimately grow into modules, and all that jazz.
// But for now it's just a simple one-page testament to bad programming.

$(function() {

	$("div").on('mousedown', ".view", function(){
		if (editing !== undefined) {
			editing.saveAndClose();
		}
		return false;
	});
	$("div").on('mousedown', ".edit", function(){
		return false;
	});
	$("div").on('mousedown', "#toolbar", function(){
		return false;
	});
	$('body').on('mousedown', null, function() {
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
	$("#toolbar").on('click', 'button', function() {
		var index = editing.model.collection.indexOf(editing.model);
		index += 1;
		console.log(this.name);
		editing.model.collection.add(
			new lineTypes[this.name].model(),
			{at: index}
		);
		editing.blurLast();
	});

	var math = mathjs();
	var MathScope = {};

	// Abstract line model.
	var LineItem = Backbone.Model.extend({

		defaults: function() {
			return {
				lineType: "Blank",
				value: 0,
				dependants: []
			};
		},

		initialize: function() {
			this.listenTo(this, 'add', this.setScope);
		},

		setScope: function() {
			var scope = this.get("scope");
			if (scope !== undefined) {
				MathScope[scope] = this.get("value");
				this.collection.modelScopes[scope] = this;
			}
		},

		calculate: function() {
			/* jshint ignore:start */
			var result = math.eval(this.get("formula"), MathScope);
			/* jshint ignore:end */
			this.set("value", result);
		},

		view: {}

	});

	var editing;

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
			"change .scope-value"		: "updateScope",
			"dblclick .view"			: "edit",
			"focus .edit"				: "focus",
			"blur .edit"				: "blur"//,
			//"blur .last-element"		: "blurLast"
		},

		focus: function() {
			if (editing !== undefined && this !== editing) {
				editing.$el.removeClass("editing");
			}
		},
		blur: function() {
		},

		blurLast: function() {
			this.saveAndClose();
			var index = this.model.collection.indexOf(this.model);
			this.model.collection.at(index + 1).view.edit();
		},

		saveAndClose: function() {
			_.each(this.$(".edit .form-control"), function(element, index, list) {
				if (element.name !== undefined) {
					editing.model.set(element.name, element.value);
				}
			});
			editing = undefined;
			this.$el.removeClass("editing");
			$("#toolbar").removeClass("toolbar-on");
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		prerender: function() {},
		render: function() {
			this.prerender();
			this.$el.html(this.template(this.model.toJSON()));
			this.postrender();
			return this;
		},
		postrender: function() {},

		updateScope: function() {
			var scope = this.model.get("scope");
			MathScope[scope] = parseFloat(this.$('.scope-value').val());
			this.model.collection.updateScopes(scope);
		},

		edit: function() {
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

	// Implementations of line types.
	var lineTypes = {

		Title: {
			model: LineItem.extend({
				defaults: function() {
					return {
						lineType: "Title",
						text: "New Title"
					};
				}
			}),
			view: LineView.extend({
				templates: {
					view: _.template('<h3><%= text %></h3>'),
					edit: _.template('<input type="text" name="text" class="form-control first-element" value="<%= text %>"">')
				}
			})
		},

		SectionTitle: {
			model: LineItem.extend({
				defaults: function() {
					return {
						lineType: "SectionTitle",
						text: "New Title"
					};
				}
			}),
			view: LineView.extend({
				templates: {
					view: _.template('<h4><%= text %></h4>'),
					edit: _.template('<input type="text" name="text" class="form-control first-element" value="<%= text %>"">')
				}
			})
		},

		Paragraph: {
			model: LineItem.extend({
				defaults: function() {
					return {
						lineType: "Paragraph",
						bodyText: "New Paragraph"
					};
				}
			}),
			view: LineView.extend({
				templates: {
					view: _.template('<div class="paragraph-fix"><p><%= formattedText %></p></div>'),
					edit: _.template('<textarea type="text" name="bodyText" class="form-control first-element last-element"><%= bodyText %></textarea>')
				},
				prerender: function() {
					this.model.set('formattedText', this.model.get('bodyText').replace('\n', '<p></p>'));
				}
			})
		},

		Image: {
			model: LineItem.extend({
				defaults: function() {
					return {
						lineType: "Image"
					};
				}
			}),
			view: LineView.extend({
				template: _.template('<img src="<%= image %>" class="img-rounded img-responsive img-center">')
			})
		},

		Input: {
			model: LineItem.extend({
				defaults: function() {
					return {
						lineType: "Input",
						description: "New Parameter",
						symbol: "P",
						value: 0,
						unit: "kN",
						scope: ""
					};
				}
			}),
			view: LineView.extend({
				templates: {
					view: _.template([
						'<div class="form-horizontal">',
							'<div class="form-group list-form-group">',
								'<div class="col-sm-7">',
									'<p class="form-control-static"><%= description %></p>',
								'</div>',
								'<div class="col-sm-5">',
									'<div class="input-group">',
										'<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
										'<input type="text" class="form-control scope-value" value="<%= value %>">',
										'<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					].join('\n')),
					edit: _.template([
						'<div class="form-horizontal">',
							'<div class="form-group list-form-group">',
								'<div class="col-sm-7">',
									'<input type="text" class="form-control first-element" name="description" value="<%= description %>">',
								'</div>',
								'<div class="col-sm-5">',
									'<div class="input-group">',
										'<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
										'<input type="text" class="form-control last-element" value="<%= value %>">',
										'<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					].join('\n'))
				},
				postrender: function() {
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
				}
			})
		},

		Formula: {
			model: LineItem.extend({
				defaults: function() {
					return {
						lineType: "Formula",
						description: "New Parameter",
						symbol: "P",
						latex: "0",
						formula: "0.0",
						unit: "kN",
						scope: "",
						value: 0
					};
				}
			}),
			view: LineView.extend({
				template: _.template([
					'<p><%= description %></p>',
					'<div class="latex-line">',
						'\\[<%= symbol %> = <%= latex %>\\]',
					'</div>',
					'<div class="form-horizontal">',
						'<div class="form-group list-form-group">',
							'<div class="col-sm-7">',
							'</div>',
							'<div class="col-sm-5">',
								'<div class="input-group">' ,
									'<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
								'<p class="form-control"><%= value %></p>',
								'<span class="input-group-addon latex-addon">\\(\\mathrm{<%= units %>}\\)</span>',
							'</div>',
						'</div>',
					'</div>'
				].join('\n')),
				postrender: function() {
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el]);
				}
			})
		}
	};


	// Collection of lines forming a single pad.
	var LineCollection = Backbone.Collection.extend({

		model: function (attrs, options) {
			var type = attrs.lineType;
			if (type in lineTypes) {
				return new lineTypes[type].model(attrs, options);
			} else {
				return new LineItem(attrs, options);
			}
		},

		url: 'json/beam.json',

		modelScopes: {},

		setScopes: function() {
			var col = this;
			_.each(this.models, function(element, index, list) {
				var deps = element.get("deps");
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
		}

	});
	var Lines = new LineCollection();


	// CalcPad Application view
	var PadView = Backbone.View.extend({

		el: $(".container"),

		initialize: function() {
			this.listenTo(Lines, 'add', this.addOne);
			this.listenTo(Lines, 'reset', this.addAll);
			this.listenTo(Lines, 'all', this.render);

			Lines.fetch({
				success: function(model, response) {
					Lines.setScopes();
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
				this.$('#pad a:nth-child(' + options.at + ')').after(line.view.render().el);
			} else {
				this.$("#pad").append(line.view.render().el);
			}
		},

		addAll: function() {
			console.log("addAll");
		},
	});

	var Pad = new PadView();

});