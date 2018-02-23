$(document).ready(function(){
    $("#searchUser").keypress(function(e) {
        if(e.which == 13) {
            $(".row").empty();  // Clean cards case new user is searched
            if($("#searchUser").val() != "") searchUser();
        }
    });

    $('.filter').on('click', function(){
        // Change the text and value of the button with dropdown's item
        $('#btnFilter').text($(this).text());
        $('#btnFilter').attr('value', $(this).attr('value'));

        // Check to see if the filter's value and orderer's value
        if($(this).attr('value') === 'none')    // Check if the btnFilter isn't set
            if($('#btn-language').attr('value') === 'none')
                searchUser();       // Case none of the are set
            else
                languageFilter($('#btn-language').attr('value'));
        else if($('#btn-language').attr('value') === 'none')    // Check if the btn-language isn't set
            orderBy($(this).attr('value'));
        else
            filterBoth($(this).attr('value'), $('#btn-language').attr('value'));    // Case both are set
    });


    $(".language").on('click', function(){
        // Change the text and value of the button with dropdown's item
        $('#btn-language').text($(this).text());
        $('#btn-language').attr('value', $(this).attr('value'));

        // Check to see if the filter value and orderer value
        if($(this).attr('value') === 'none')    // Check if the btn-language isn't set
            if($('#btnFilter').attr('value') === 'none')    
                searchUser();       // Case none of them are set
            else
                orderBy($('#btnFilter').attr('value'));
        else if($('#btnFilter').attr('value') === 'none')   // Check if the btnFilter isn't set
            languageFilter($(this).attr('value'));
        else
            filterBoth($('#btnFilter').attr('value'), $(this).attr('value'));   // Case both are set
        
    });

});

// Get's the name of the user on input
function getUser(){
    return $('#searchUser').val();
}

// Function to return every starred project from the user
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

// Function to order the cards
function orderBy(orderer){
    $('.row').empty();
    $.ajax({
        url: 'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(data){
        // Checking to see by which will be ordered
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

// Filter the repos languages
function languageFilter(language){
    $('.row').empty();
    arr = [];
    $.ajax({
        url:  'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(starred){
        // It cleans returned object from the request and creates a new array with filteres repos
        arr = $.grep(starred, function(value){
            return (value.language === language);
        });

        $(arr).each(function(index){
            buildCards(arr, index);
        });
    });
}

// Function to filter using both, filters and order
function filterBoth(orderer, language){
    $('.row').empty();
    $.ajax({
        url: 'https://api.github.com/users/'+getUser()+'/starred'
    }).done(function(data){
        // Checking to see by which will be ordered
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

        // It cleans returned object from the request and creates a new array with filteres repos
        arr = $.grep(data, function(value){
            return (value.language === language);
        });

        $(arr).each(function(index){
            buildCards(arr, index);
        });
    });
}

// Function to create the cards
function buildCards(starred, index){
    $(".row").append("<div class='col-md-4' id='" + starred[index].name + " " + starred[index].language + "'>"
                    +  "<div class='card' style='width: 18rem;'>"
                    +  "<div class='card-body'>"
                    +  "<h3 class='card-title'><b>" + starred[index].name + "</b></h3>" 
                    +  "<h6 class='card-subtitle mb-2 text-muted'>" + starred[index].owner.login + "</h6>"
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
