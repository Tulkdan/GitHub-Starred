$(document).ready(function(){
    $("#searchUser").keypress(function(e) {
        if(e.which == 13) {
            $(".row").empty();
            if($("#searchUser").val() != "") searchUser();
        }
    });

    $('.filter').on('click', function(){
        $('#btnFilter').text($(this).text());
        $('#btnFilter').attr('value', $(this).attr('value'));
        if($(this).attr('value') === 'none')
            if($('#btn-language').attr('value') === 'none')
                searchUser();
            else
                languageFilter($('#btn-language').attr('value'));
        else if($('#btn-language').attr('value') === 'none')
            orderBy($(this).attr('value'));
        else
            filterBoth($(this).attr('value'), $('#btn-language').attr('value'));
    });


    $(".language").on('click', function(){
        $('#btn-language').text($(this).text());
        $('#btn-language').attr('value', $(this).attr('value'));
        if($(this).attr('value') === 'none')
            if($('#btnFilter').attr('value') === 'none')
                searchUser();
            else
                orderBy($('#btnFilter').attr('value'));
        else if($('#btnFilter').attr('value') === 'none')
            languageFilter($(this).attr('value'));
        else
            filterBoth($('#btnFilter').attr('value'), $(this).attr('value'));
        
    });

});

function getUser(){
    return $('#searchUser').val();
}

function searchUser(){
    $('.row').empty();
    $.ajax({
        url: 'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(starred){        
        $(starred).each(function(index){
            buildCards(starred, index);
        });
    });    
};

function orderBy(orderer){
    $('.row').empty();
    $.ajax({
        url: 'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(data){
        if(orderer === 'name'){
            data.sort(function(a, b){
                return a.name > b.name ? 1 : -1;
            });
        } else if(orderer === 'stargazers_count'){
            data.sort(function(a, b){
                return a.stargazers_count > b.stargazers_count ? 1 : -1;
            });
        } else {
            data.sort(function(a, b){
                return a.open_issues > b.open_issues ? 1 : -1;
            });
        }

        $(data).each(function(index){
            buildCards(data, index);
        });
    });
}

function languageFilter(language){
    $('.row').empty();
    arr = [];
    $.ajax({
        url:  'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(starred){
        arr = $.grep(starred, function(value){
            return (value.language === language);
        });
        $(arr).each(function(index){
            buildCards(arr, index);
        });
    });
}

function filterBoth(orderer, language){
    $('.row').empty();
    $.ajax({
        url: 'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(data){
        if(orderer === 'name'){
            data.sort(function(a, b){
                return a.name > b.name ? 1 : -1;
            });
        } else if(orderer === 'stargazers_count'){
            data.sort(function(a, b){
                return a.stargazers_count > b.stargazers_count ? 1 : -1;
            });
        } else {
            data.sort(function(a, b){
                return a.open_issues > b.open_issues ? 1 : -1;
            });
        }

        arr = $.grep(data, function(value){
            return (value.language === language);
        });


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
