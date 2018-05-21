import { createElement, render, renderDom } from './element';
import diff from './diff';
import patch from './patch';

let vertualDom = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['a']),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['c']),
    createElement('li', {class: 'item'}, [
        createElement('div', {class: 'sub-item'}, ['d']),
        createElement('div', {class: 'sub-item'}, ['d']),
        createElement('div', {class: 'sub-item'}, ['d']),
        'd'
    ]),
    createElement('li', {class: 'item'}, ['e'])
]);

let vertualDom2 = createElement('ul', {class: 'list-group', id: 'ls'}, [
    createElement('li', {class: 'item active'}, ['1']),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: ''}, ['3']),
    createElement('div', {class: 'item'}, [
        createElement('span', {class: 'sub-item'}, ['d']),
        'c'
    ])
]);

// 将虚拟 dom 转化成了真实 dom 渲染到页面上
let el = render(vertualDom);
renderDom(el, window.root);
console.log(vertualDom);
console.log(el);

// dom diff 比较两个虚拟 Dom 区别，比较两个对象的区别
let patches = diff(vertualDom, vertualDom2);

// dom diff 作用，根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁用来更新 dom
window.onload = function () {
    let btn = document.getElementById('btn');
    btn.addEventListener('click', function () {
        patch(el, patches);
    });
}