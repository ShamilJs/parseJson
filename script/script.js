'use strict';

const inputFile = document.querySelector('.select__file');
const container = document.querySelector('.container');
const resetFile = document.querySelector('.reset__file');
let form;
const modal = document.querySelector('.modal');
let arrData = [];


const createElementForm = (elem, arg) => {
    const element = document.createElement(elem);
    if (elem === 'form') {
        container.append(element);
        return;
	}
	if (elem === 'select') {
		const arr = [];
		arg.technologies.forEach(item => arr.push(`<option>${item}</option>`));
		element.innerHTML = arr.join(' ');
	}
    if (elem === 'input') {
        for (let key in arg) {
            if (key === 'mask') element.setAttribute('placeholder', `${arg[key]}`);
            if (arg[key] === 'technology') {
				createElementForm('select', arg);
				return;	
            }
            element.setAttribute(`${key}`, `${arg[key]}`);
        }
    } 
    if (elem === 'label' || elem === 'p' || elem === 'h1' || elem === 'button') element.textContent = `${arg}`;
    if (elem === 'a') {
        if (!arg.ref || !arg.text) return;
        element.setAttribute('href', `${arg.ref}`);
        element.textContent = `${arg.text}`;
    }
    form.append(element); 
};

const createFields = fields => {
    fields.forEach(item => {
        const {label, input} = item;
        if (label) createElementForm('label', label);            
        if (input) createElementForm('input', input);        
    });
};

const createReferences = references => {
    const obj = {};
    references.forEach(item => {
        for(let key in item) {
            if (key === 'input') createElementForm('input', item[key]);
            if (key === 'text without ref') createElementForm('p', item[key]);
            if (key === 'ref' ) obj.ref = item[key];
            if (key === 'text') obj.text = item[key];
        } 
    });
    createElementForm('a', obj); 
};

const initFunction = request => {
    const data = JSON.parse(request.responseText);
    arrData = data;
    createElementForm('form', arrData.name);
    const forms = document.querySelectorAll('form');
    forms.forEach(item => {
        if (item.innerHTML === '') form = item;
    });
    if (arrData.name) createElementForm('h1', arrData.name);
    if (arrData.fields) createFields(arrData.fields);
    if (arrData.references) createReferences(arrData.references);
    if (arrData.buttons) arrData.buttons.forEach(item => createElementForm('button', item.text));
};

const errorFunction = () => {
    console.log('error');
};

const getData = () => {
    return new Promise((resolve, reject) => {
        const request  = new XMLHttpRequest();
        request.open('GET', `./json/${inputFile.files[0].name}`);
        request.addEventListener('readystatechange', event => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                resolve(request);
            } else {
                reject(request.statusText);
            }
        });
        request.send();
    });
};

inputFile.addEventListener('input', () => {
	document.querySelector('.input__file-button-text').textContent = inputFile.files[0].name;
    getData()
    .then(initFunction)
    .catch(errorFunction);
});

resetFile.addEventListener('click', () => { 
	document.querySelector('.input__file-button-text').textContent = 'Выберите файл';
    arrData = [];
    container.textContent = '';
    inputFile.value = '';
});





    

