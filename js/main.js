$(document).ready(function(){

    $(".btn-primary").on('click', function(){
        let username = document.getElementById("searchUser").value;
        
        
        $.ajax({
            url: 'https://api.github.com/users/'+username
        }).done(function(user){
            console.log(user);
        })

        $.ajax({
            url: 'https://api.github.com/users/'+username+'/starred'
        }).done(function(starred){
            console.log(starred);
            $(starred).each(function(index){
                $(".row").append("<div class='col-md-4'>"
                        +  "<div class='card' style='width: 18rem;'>"
                        +  "<div class='card-body'>"
                        +  "<h3 class='card-title'><b>" + starred[index].name + "</b></h3>" 
                        +  "<p class='card-text'>" + starred[index].description + "</p>"
                        +  "<p>"
                        +  "<div class='d-inline octicon octicon-star badge badge-pill badge-danger'> " + starred[index].stargazers_count + "</div>  "
                        +  "<div class='d-inline octicon octicon-issue-opened badge badge-pill badge-primary'> " + starred[index].open_issues + "</div>"
                        +  "</p>"
                        +  "<div class='d-flex justify-content-between align-items-center'>"
                        +  "<div class='btn-group'>"
                                + "<a href='" + starred[index].html_url + "'><button type='button' class='btn btn-sm btn-outline-secondary'>View</button></a>"
                        +  "</div>"
                        +  "<small class='text-muted'>" + starred[index].language + "</small>"
                        +    "</div>"
                        +"</div></div></div>"
                )

            })
        })
    });


    
});

