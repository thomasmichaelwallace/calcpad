<div class="form-horizontal">
    <span class="mathquill-editable mathquill-bootstrap mathquill-bootstrap-area"><%= latex %></span>
</div>
<div class="form-horizontal">
    <div class="form-group list-form-group">
        <div class="col-sm-7">
            <input type="text" class="form-control first-element" name="description" value="<%= description %>">
        </div>
        <div class="col-sm-3">
            <span class="mathquill-editable mathquill-bootstrap" id="symbol"><%= symbol %></span>
        </div>
        <div class="col-sm-2">
            <input type="text" class="form-control" name="unit" value="<%= unit %>">
        </div>
    </div>
</div>