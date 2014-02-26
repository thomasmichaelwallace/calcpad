<%= description %>
<div class="pull-right">
    <% if (value) { %>
        <span class="align-right label label-success"><span class="glyphicon glyphicon-ok"></span></span>
    <% } else { %>
        <span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span>
    <% } %>
</div>
<div class="latex-line">
    \[<%= latex %>\]
</div>