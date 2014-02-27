<p><%= description %></p>
<div class="latex-line">
    \[<%= symbol %> = <%= latex %>\]
</div>
<div class="form-horizontal conditional">
    <div class="form-group list-form-group">
        <div class="col-sm-7">
        </div>
        <div class="col-sm-5">
            <div class="input-group"> 
                <span class="input-group-addon latex-addon">\(<%= symbol %>\)</span>
                <p class="form-control">
                    <% if(value !== null && value !== undefined) { %>
                        <%= value.toPrecision(3) %>
                    <% } %>
                </p>
                <span class="input-group-addon latex-addon">\(\mathrm{<%= unit %>}\)</span>
            </div>
        </div>
    </div>
</div>