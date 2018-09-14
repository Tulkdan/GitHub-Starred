let search = document.querySelector('#searchUser');
let row = document.querySelector('.row');
let filters = document.querySelectorAll('.filter');
let btn_filter = document.querySelector('#btnFilter');
let languages = document.querySelectorAll('.language');
let btn_language = document.querySelector('#btn-language');

search.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    while (row.firstChild) row.removeChild(row.firstChild);

    if (search.value != '')
      searchUser();
  }
});

filters.forEach( (element) => {
  element.addEventListener('click', (el) => {
    // Change the text and value of the button
    btn_filter.innerText = el.target.innerText;
    btn_filter.value = el.target.attributes[1].value;

    // Check to see if the filter's value and orderer's value
    if (el.target.attributes[1].value === 'none') {
      if (btn_language.value === 'none')
        searchUser(); // Case none of them are set
      else
        languageFilter(btn_language.value);
    } else if (btn_language.value === 'none') // Check if btn-language isn't set
      orderBy(el.target.attributes[1].value);
    else
      filterBoth(el.target.attributes[1].value, btn_language.value); // Case both are set
  });
});

languages.forEach( (element) => {
  element.addEventListener('click', (el) => {
    btn_language.innerText = el.target.innerText;
    btn_language.value = el.target.attributes[1].value;

    if (el.target.attributes[1].value === 'none') {
      if (btn_filter.value === 'none')
        searchUser();
      else
        orderBy(btn_filter.value);
    } else if (btn_filter.value === 'none')
      languageFilter(el.target.attributes[1].value);
    else
      filterBoth(btn_filter.value, el.target.attributes[1].value);
  });
});

// Function to return every starred project from the user
function searchUser(){
  btn_filter.value = 'none'; btn_filter.innerText = 'Filter by';
  btn_language.value = 'none'; btn_language.innerText = 'Language';
  while (row.firstChild) row.removeChild(row.firstChild);

  fetch('https://api.github.com/users/' + search.value + '/starred')
    .then( (starred) => starred.json())
    .then( (data) => {
      data.forEach( (el) => {
        buildCards(el);
      });
    });
}

// Function to order the cards
function orderBy(orderer){
  while (row.firstChild) row.removeChild(row.firstChild);

  fetch('http://api.github.com/users/' + search.value + '/starred')
    .then( (starred) => starred.json())
    .then( (data) => {
      if (orderer === 'name') {
        data.sort( (a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
      } else if (orderer === 'stargazers_count') {
        data.sort( (a,b) => (a.stargazers_count > b.stargazers_count) ? 1 : -1);
      } else {
        data.sort( (a,b) => (a.open_issues > b.open_issues) ? 1 : -1);
      }
      return data;
    }).then( (filtered) => {
      filtered.forEach( (el) => {
        buildCards(el);
      });
    });
}

// Filter the repos languages
function languageFilter(language){
  while (row.firstChild) row.removeChild(row.firstChild);

  fetch('https://api.github.com/users/' + search.value + '/starred')
    .then( (starred) => starred.json())
    .then( (data) => {
      let arr = data.filter( (d) => {
        return d.language === language
      });
      return arr;
    }).then( (filtered) => {
      filtered.forEach( (el) => {
        buildCards(el);
      });
    });
}

// Function to filter and order
function filterBoth(orderer, language){
  while (row.firstChild) row.removeChild(row.firstChild);

  fetch('https://api.github.com/users/' + search.value + '/starred')
    .then( (starred) => starred.json())
    .then( (data) => {
      if (orderer === 'name') {
        data.sort( (a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
      } else if (orderer === 'stargazers_count') {
        data.sort( (a,b) => (a.stargazers_count > b.stargazers_count) ? 1 : -1)
      } else {
        data.sort( (a,b) => (a.open_issues > b.open_issues) ? 1 : -1)
      }
      return data;
    }).then( (arr) => {
      return arr.filter( (d) => d.language === language)
    }).then( (filtered) => {
      filtered.forEach( (el) => {
        buildCards(el);
      });
    });
}

// Function to create the cards
function buildCards(index){
  let card = document.createElement('div');
  card.className = 'card';
  card.style.width = '18rem';
  let card_body = document.createElement('div');
  card_body.className = 'card-body';
    let title = document.createElement('h3');
    title.className = 'card-title';
    title.innerHTML = '<b>' + index.name + '</b>';
  card_body.appendChild(title);
    let sub_title = document.createElement('h6');
    sub_title.className = 'card-subtitle mb-2 text-muted';
    sub_title.innerText = index.owner.login;
  card_body.appendChild(sub_title);
    let card_text = document.createElement('p');
    card_text.className = 'card-text';
    card_text.innerText = index.description;
  card_body.appendChild(card_text);
    let badges = document.createElement('p');
      let badge1 = document.createElement('div');
      badge1.className = 'd-inline octicon octicon-star badge badge-pill badge-danger';
      badge1.innerText = index.stargazers_count;
    badges.appendChild(badge1);
      let badge2 = document.createElement('div');
      badge2.className = 'd-inline octicon octicon-issue-opened badge badge-pill badge-primary';
      badge2.innerText = index.open_issues;
    badges.appendChild(badge2);
  card_body.appendChild(badges);
    let div_flex = document.createElement('div');
    div_flex.className = 'd-flex justify-content-between align-items-center';
      let btn_group = document.createElement('div');
      btn_group.className = 'btn-group';
        let a = document.createElement('a');
        a.href = index.html_url;
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary';
        btn.innerText = 'View';
        a.appendChild(btn);
      btn_group.appendChild(a);
    div_flex.appendChild(btn_group);
      let small = document.createElement('small');
      small.className = 'text-muted';
      small.innerText = index.language;
    div_flex.appendChild(small);
  card_body.appendChild(div_flex);
  card.appendChild(card_body);
  let div_Master = document.createElement('div');
  div_Master.className = 'col-md-4';
  div_Master.id = index.name + '_' + index.language;
  div_Master.appendChild(card);

  row.appendChild(div_Master);
};
