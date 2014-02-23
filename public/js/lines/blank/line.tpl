<div class="messages">
    <% _.each(this.messages, function(message) { %>
        <div id="<%= message.name %>" class="alert alert-<%= message.alert %>">
            <% if (message.dismissable) { %>
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <% } %>
            <%= message.message %>
        </div>
    <% }); %>
</div>
<div class="view row">
    <table class="table table-bordered table-list">
        <tbody>
            <tr>
                <td class="col-sm-1">
                    <%= this.model.get("leftMargin") || "" %>
                </td>
                <td class="col-sm-10 left-margin right-margin">
                    <%= this.templates.view(this.model.templateJSON()) %>
                </td>
                <td class="col-sm-1">
                    <%= this.model.get("rightMargin") || "" %>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div class="edit row">
    <table class="table table-bordered table-list">
        <tbody>
            <tr>
                <td class="col-sm-1">
                    <%= this.model.get("leftMargin") || "" %>
                </td>
                <td class="col-sm-10 left-margin right-margin">
                    <%= this.templates.edit(this.model.templateJSON()) %>
                </td>
                <td class="col-sm-1">
                    <%= this.model.get("rightMargin") || "" %>
                </td>
            </tr>
        </tbody>
    </table>
</div>