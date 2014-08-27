<div class="row">
    <div class="pagination-statistics col-md-6" style="margin-bottom: 10px;">
        当前第 <%= start %> - <%=end%> 条，共 <%= total %> 条，每页展现
        <select bx-id="gallery/dropdown">
            <% for( var i = 0, limits = [10,15,20,30,50]; i < limits.length; i++ ) { %>
            <option value="<%= limits[i] %>" <%= limits[i] == limit ? 'selected' : '' %>><%=limits[i]%></option>
            <% } %>
        </select>
        条
    </div>
    <ul class="pagination col-md-6" style="margin: 0; float: right; margin-bottom: 10px;">

        <li class="<%= hasPrev ? '' : 'disabled' %>"><a href="javascript: void(0);" bx-click="moveTo(<%=prev%>)">Previous</a></li>

        <% if( barStart == 2 ) { %>
            <li><a class="page" href="javascript: void(0);">1</a></li>
        <% } %>

        <% if( barStart >= 3 ) { %>
            <li><a href="javascript: void(0);" bx-click="moveTo(1)">1</a></li>
            <li><a href="javascript: void(0);" bx-click="moveTo(1)">2</a></li>
            <% if( barStart > 3 ) { %>
                <li class="disabled"><a href="javascript: void(0);">...</a></li>
            <% } %>
        <% } %>

        <% for( var i = barStart; i <= barEnd; i++ ) { %>
            <% if( i === cursor ) { %>
                <li class="active"><a href="javascript: void(0);"><%= i %></a></li>
            <% } else { %>
                <li><a href="javascript: void(0);" bx-click="moveTo(<%=i%>)"><%= i %></a></li>
            <% } %>
        <% } %>

        <% if( barEnd < pages - 1) { %>
            <li class="disabled"><a href="javascript: void(0);">...</a></li>
        <% } %>

        <% if( barEnd < pages) { %>
            <li><a href="javascript: void(0);" bx-click="moveTo(<%=pages%>)"><%= pages %></a></li>
        <% } %>

        <li class="<%= hasNext ? '' : 'disabled' %>"><a href="javascript: void(0);" bx-click="moveTo(<%=next%>)">Next</a></li>

        <li>
            <select bx-id="gallery/dropdown">
                <% for( var i = 1; i <= pages; i++ ) { %>
                    <option value="<%= i %>" <%= i == cursor ? 'selected' : '' %>><%= i %></option>
                <% } %>
            </select>
        </li>

    </ul>
</div>