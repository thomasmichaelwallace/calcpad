<div class="form-horizontal">
    <div class="form-group list-form-group">
        <div class="col-sm-7">
            <p class="form-control-static"><%= description %></p>
        </div>
        <div class="col-sm-5">
            <div class="input-group">
                <span class="input-group-addon latex-addon">\(<%= symbol %>\)</span>
                <input type="text" class="form-control scope-value" value="<%= value %>">
                <span class="input-group-addon latex-addon">\(\mathrm{<%= unit %>}\)</span>
            </div>
        </div>
    </div>
</div>