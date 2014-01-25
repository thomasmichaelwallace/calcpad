// Development Scratch for CalcPad

// This file will ultimately grow into modules, and all that jazz.
// But for now it's just a simple one-page testament to bad programming.

$.getJSON("/json/beam.json", function( data ) {
	// Start by fetching predetermined data on load; this will change with time.
	renderPad(data);
})

function renderPad( pad ) {
	// Renders each line of the pad, using that object type's renderer.

	console.log("[CalcPad] Rendering: " + pad.name)	;

	for (var lineNo = 0; lineNo < pad.lines.length; lineNo++) {
		var line = pad.lines[lineNo];

		var $selectors = $('<a href="#" class="list-group-item"></a>').appendTo($('#Pad'));		
		lineTypers[line.lineType].render( line, $selectors );
	}
}

var lineTypers = {
	// Modules for each line-types.

	Title: {
		render: function( line, parent ) {
			parent.append('<h3>' + line.text + '</h3>');
		}
	},
	SectionTitle: {
		render: function( line, parent ) {
			parent.append('<h4>' + line.text + '</h4>');
		}
	},	
	Paragraph: {
		render: function( line, parent ) {
			parent.append('<p>' + line.bodyText.replace('\n', '<p></p>') + '</p>');

		}
	},
	Image: {
		render: function( line, parent ) {
			parent.append('<img src="' + line.image + '" class="img-rounded img-responsive img-center">');
		}
	},
	Input: {
		render: function( line, parent ) {
			parent.append(
				'<div class="form-horizontal">' + 
					'<div class="form-group list-form-group">' +
						'<div class="col-sm-7">' +
							'<p class="form-control-static">' + line.description + '</p>' + 
						'</div>' +
						'<div class="col-sm-5">' +
							'<div class="input-group">' +
								'<span class="input-group-addon latex-addon">\\(' + line.symbol + '\\)</span>' +
								'<input type="text" class="form-control" placeholder="' + line.default + '">' +
								'<span class="input-group-addon latex-addon">\\(\\mathrm{' + line.unit + '}\\)</span>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		}
	},
	Formula: {
		render: function( line, parent ) {
			var value = 62.5;
			parent.append(
				'<p>' + line.description + '</p>' +
				'<div class="latex-line">' +
					'\\[' + line.symbol + '=' + line.latex + '\\]' +
				'</div>' +
				'<div class="form-horizontal">' +
					'<div class="form-group list-form-group">' +
						'<div class="col-sm-7">' +
						'</div>' +
						'<div class="col-sm-5">' +
							'<div class="input-group">' + 
							'<span class="input-group-addon latex-addon">\\(' + line.symbol + '\\)</sub></span>' +
							'<p class="form-control">' + value + '</p>' +
							'<span class="input-group-addon latex-addon">\\(\\mathrm{' + line.units + '}\\)</span>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
		}
	}
}