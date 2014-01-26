// Development script for CalcPad

// This file will ultimately grow into modules, and all that jazz.
// But for now it's just a simple one-page testament to bad programming.

$(function() {

	// Abstract line model.
	var LineItem = Backbone.Model.extend({

		defaults: function() {
			return {
				lineType: "Blank"
			};
		}

	});

	// Abstract line view.
	var LineView = Backbone.View.extend({

		tagName: "a",
		className: "list-group-item",

		template: _.template('<p><%= lineType %></p>'),

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		prerender: function() { },
		postrender: function() { },

		render: function() {
			this.prerender();
			this.$el.html(this.template(this.model.toJSON()));
			this.postrender();
			return this;
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
				template: _.template('<h3><%= text %></h3>')
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
				template: _.template('<h4><%= text %></h4>')
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
				template: _.template('<p><%= formattedText %></p>'),
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
				template: _.template([
					'<div class="form-horizontal">',
						'<div class="form-group list-form-group">',
							'<div class="col-sm-7">',
								'<p class="form-control-static"><%= description %></p>',
							'</div>',
							'<div class="col-sm-5">',
								'<div class="input-group">',
									'<span class="input-group-addon latex-addon">\\(<%= symbol %>\\)</span>',
									'<input type="text" class="form-control" placeholder="<%= value %>">',
									'<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				].join('\n'))
			}),
			postrender: function() {
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
			}
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
				].join('\n'))
			}),
			postrender: function() {
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
			}
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

	});
	var Lines = new LineCollection();


	// CalcPad Application view
	var PadView = Backbone.View.extend({

		el: $(".container"),

		initialize: function() {
			this.listenTo(Lines, 'add', this.addOne);
			this.listenTo(Lines, 'reset', this.addAll);
			this.listenTo(Lines, 'all', this.render);

			Lines.fetch();
		},

		addOne: function(line) {
			var type = line.get('lineType');
			var view;
			if (type in lineTypes) {
				view = new lineTypes[type].view({ model: line });
			} else {
				view = new LineView({ model: line });
			}
			this.$("#pad").append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function() {
			Lines.each(this.addOne, this);
		},
	});

	var Pad = new PadView();

});