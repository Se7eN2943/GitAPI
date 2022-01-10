let search = document.querySelector('#serch')
let searchHelp = document.querySelector('.serch_help')
let blanks = document.querySelector('.blanks')
let input = document.querySelector('input')
let resArr

const debounce = (fn, debounceTime) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), debounceTime)
    }
};

function searching() {
    let arrValue = search.value.split('')
    if (arrValue.length == 0) {
        searchHelp.style.display = "none"
        return
    }
    if (arrValue.findIndex(i => i !== ' ') !== -1) {
        fetch(`https://api.github.com/search/repositories?q=${search.value}&per_page=5&sort=stars`).then(resp => resp.json()).then(res => {
            resArr = res.items
            let helpBlank = document.querySelectorAll('.serch_help__blank')
            if (helpBlank !== null) helpBlank.forEach(el => el.remove())
            for (const i in resArr) {
                let elem = document.createElement('div');
                elem.classList.add("serch_help__blank")
                elem.textContent = resArr[i].name
                searchHelp.style.display = "block"
                searchHelp.appendChild(elem)
                searchHelp.addEventListener('click', add)
            }
        })
    }
}

function add(e) {
    let elem = document.createElement('div');
    elem.classList.add("blanks_addesBlank")
    for (const i in resArr) {
        if (e.target.textContent === resArr[i].name) {
            elem.innerHTML = `<div class= text_add> Name: ${resArr[i].name}  <br> Owner: ${resArr[i].owner.login} <br> Stars: ${resArr[i].stargazers_count}</div> <div class=close></div>`
            blanks.appendChild(elem)
            input.value = null
            searchHelp.style.display = "none"
            blanks.addEventListener('click', removeBlanks)
            searchHelp.removeEventListener('click', add)
        }
    }
}

function removeBlanks(e) {
    if (e.target.classList.value == 'close') e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    if (blanks.children.length === 0) blanks.removeEventListener('click', removeBlanks)
}

search.addEventListener('keyup', debounce(searching, 350))
