arr = [];

$(document).ready(function(){
    $("#searchUser").keypress(function(e) {
        if(e.which == 13) {
            $(".row").empty();
            if($("#searchUser").val() != "") searchUser(getUser());
        }
    });

    $(".dropdown-item").on('click', function(){
        if($(this).attr('value') !== 'none')
            languageFilter($(this).attr('value'), $("#searchUser").val());
        else{
            searchUser($("#searchUser").val());

        }
    });

});

function getUser(){
    return $('#searchUser').val();
}

function searchUser(username){
    $('.row').empty();
    $.ajax({
        url: 'https://api.github.com/users/'+username+'/starred'
    }).done(function(starred){        
        $(starred).each(function(index){
            buildCards(starred, index);
        });
    });    
};

function languageFilter(language, username){
    $('.row').empty();
    arr = [];
    $.ajax({
        url:  'https://api.github.com/users/'+username+'/starred'
    }).done(function(starred){
        arr = $.grep(starred, function(value){
            return (value.language === language);
        });
        console.log(arr);
        $(arr).each(function(index){
            buildCards(arr, index);
        });
    });
    
}

function buildCards(starred, index){
    $(".row").append("<div class='col-md-4' id='" + starred[index].name + " " + starred[index].language + "'>"
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
    );

};
