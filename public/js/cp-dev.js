// Development Scratch for CalcPad

// This file will ultimately grow into modules, and all that jazz.
// But for now it's just a simple one-page testament to bad programming.

$.getJSON("/json/beam.json", function( data ) {
	// Start by fetching predetermined data on load; this will change with time.
	renderPad(data);
});

function renderPad( pad ) {
	// Renders each line of the pad, using that object type's renderer.

	console.log("[CalcPad] Rendering: " + pad.name)	;

	for (var lineNo = 0; lineNo < pad.lines.length; lineNo++) {
		var line = pad.lines[lineNo];

		var $selectors = $('<a class="list-group-item"></a>').appendTo($('#Pad'));		
		lineTypers[line.lineType].render( line, $selectors );
	}
}

var lineTypers = {
	// Modules for each line-types.

	Title: {
		templates: {
			view: _.template('<h3><%= text %></h3>')
		},
		render: function( line, parent ) {
			parent.append(this.templates.view(line));
		}
	},
	SectionTitle: {
		templates: {
			view: _.template('<h4><%= text %></h4>')
		},
		render: function( line, parent ) {
			parent.append(this.templates.view(line));
		}
	},	
	Paragraph: {
		templates: {
			view: _.template('<p><%= formattedText %></p>')
		},
		render: function( line, parent ) {
			line.formattedText = line.bodyText.replace('\n', '<p></p>');
			parent.append(this.templates.view(line));			
		}
	},
	Image: {
		templates: {
			view: _.template('<img src="<%= image %>" class="img-rounded img-responsive img-center">')
		},
		render: function( line, parent ) {
			parent.append(this.templates.view(line));
		}		
	},
	Input: {
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
								'<input type="text" class="form-control" placeholder="<%= value %>">',
								'<span class="input-group-addon latex-addon">\\(\\mathrm{<%= unit %>}\\)</span>',								
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			].join('\n'))
		},		
		render: function( line, parent ) {
			parent.append(this.templates.view(line));			
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		}
	},
	Formula: {
		templates: {
			view: _.template([
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
		},		
		render: function( line, parent ) {
			parent.append(this.templates.view(line));			
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		}
	}
};