<p class="text-info">Automatically generated view for unknown line-type: <%= lineType %></p>
<form class="form-horizontal">
	<% _.each(obj, function(value, key, list) { %>
		<% if (key !== "lineType" && value !== undefined && value !== null) { %>
			<div class="form-group">
				<label for="<%= key %>" class="col-sm-3 control-label"><%= key %></label>
				<div class="col-sm-7">
					<p class="form-control-static"><%= value %></p>
				</div>
			</div>
		<% } %>
	<% }) %>
</form>