const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
let Index = 0;

function diff(oldTree, newTree) {
    let patches = {};

    // 递归树 比较后的结果放入补丁包中
    walk(oldTree, newTree, Index, patches);
    return patches;
}

function diffChildren(oldChildren, newChildren, patches) {
    // 比较旧的第一个和新的第一个
    if(oldChildren instanceof Array) {
        oldChildren.forEach((child, idx) => {
            // 索引不应该是 index
            // 每次传递给 walk 时，index 是递增的，所有的人都基于同一个 index 来实现
            if(newChildren) {
                walk(child, newChildren[idx], ++Index, patches);
            }
        });
    }
}

function isString(node) {
    return Object.prototype.toString.call(node) === '[object String]';
}

function amendIndex(oldNode) {
    let count = oldNode.length;
    if(oldNode instanceof Array) {
        oldNode.forEach((child, idx) => {
            if(child instanceof Element) {
                count += amendIndex(child);
            } else {
                count++;
            }
        });
    }
    return count;
}

function walk(oldNode, newNode, index, patches) {
    let currentPatch = []; // 每个元素都有一个补丁对象

    if(!newNode) {
        currentPatch.push({type: REMOVE, index});
    } else if (isString(oldNode) && isString(newNode)) {
        if(oldNode !== newNode) { // 判断文本是否变化
            currentPatch.push({type: TEXT, text: newNode});
        }
    } else if (oldNode.type === newNode.type) {
        // 比较属性是否有更改
        let attrs = diffAttr(oldNode.props, newNode.props);
        // console.log(attrs);
        if(Object.keys(attrs).length > 0) {
            currentPatch.push({type: ATTRS, attrs});
        }
        // 如果有子节点应该遍历子节点
        diffChildren(oldNode.children, newNode.children, patches);
    } else {
        // 以上都不满足说明节点被替换了
        currentPatch.push({type: REPLACE, newNode});
        // 更正节点的索引
        Index += (amendIndex(oldNode.children) - 1);
    }
    if(currentPatch.length > 0) { // 当前元素确实有补丁
        // 将当前元素和补丁对应起来，放到大补丁包
        patches[index] = currentPatch;
    }
}

function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    for(let key in oldAttrs) {
        if(oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key]; // 有可能是 undefined
        }
    }
    for(let key in newAttrs) {
        // 老节点没有新节点的属性
        if(!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}
export default diff;