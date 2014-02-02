/**
 * CalcPad - Line Type Definitions
 * Copyright (C) 2014 Thomas Michael Wallace
 * Apache 2 Licensed
 */

// Line type definitions for CalcPad.

// This is not correctly modular at the moment, but it clears the dev.evelopment pad.

function loadTypes(LineItem, LineView) {
	// Implementations of line types.
	return {

		Title: {
			model: LineItem.extend({
				lineValues: {
						lineType: "Title",
						text: "New Title"
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
				lineValues: {
					lineType: "SectionTitle",
					text: "New Title"
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
				lineValues: {
					lineType: "Paragraph",
					bodyText: "New Paragraph"
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
				lineValues: {
					lineType: "Image",
					image: ""
				}
			}),
			view: LineView.extend({
				template: _.template('<img src="<%= image %>" class="img-rounded img-responsive img-center">')
			})
		},

		Input: {
			model: LineItem.extend({
				lineValues: {
					lineType: "Input",
					description: "New Parameter",
					value: 0,
					unit: "kN",
					scope: ""
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
				values: function() {
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
}