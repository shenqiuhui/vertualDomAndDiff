// 虚拟 dom 元素的类
class Element {
    constructor (type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}

// 设置属性
function setAttr(node, key, value) {
    switch(key) {
        case 'value':
            // node 是表单元素
            if(node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        case 'style': // 样式
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}

// 返回虚拟节点的
function createElement(type, props, children) {
    return new Element(type, props, children);
}

// render 方法可以将 vnode 转化成真实的 dom
function render(eleObj) {
    let el = document.createElement(eleObj.type);

    for(var key in eleObj.props) {
        // 设置属性的方法
        setAttr(el, key, eleObj.props[key]);
    }

    // 遍历虚拟 dom 的子节点，如果是虚拟 dom 继续渲染，不是就代表是文本节点
    eleObj.children.forEach(child => {
        child = (child instanceof Element) ? render(child) : document.createTextNode(child);
        el.appendChild(child);
    });
    return el;
}

// 渲染到页面
function renderDom(el, target) {
    target.appendChild(el);
}

export { createElement, render, Element, renderDom, setAttr };