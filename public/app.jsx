/** @jsx h */

function h(type, props, ...children) {
	return {
		type,
		props: props || {},
		children
	};
}

function createElement(node) {
	if (typeof node === 'string') {
		return document.createTextNode(node);
	}

	const $el = document.createElement(node.type);
	setProps($el, node.props)
	node.children
		.map(createElement)
		.forEach($el.appendChild.bind($el));

	return $el;
}

function updateElement($parent, newNode, oldNode, index = 0) {
	if (!oldNode) {
		$parent.appendChild(createElement(newNode));
	} else if (!newNode) {
		$parent.removeChild($parent.childNodes[index]);
	} else if (changed(newNode, oldNode)) {
		$parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
	} else if (newNode.type) {
		const newLength = newNode.children.length;
		const oldLength = oldNode.children.length;

		for (let i = 0; i < newLength || i < oldLength; i++) {
			updateElement(
				$parent.childNodes[index],
				newNode.children[i],
				oldNode.children[i],
				i
			);
		}
	}
}

function changed(node1, node2) {
	return typeof node1 !== typeof node2 ||
		typeof node1 === 'string' && node1 !== node2 ||
		node1.type !== node2.type;
}


function setProp($target, name, value) {
	if (isCustomProp(name)) {
		return;
	} else if (name === 'className') {
		$target.setAttribute('class', value);
	} else if (typeof value === 'boolean') {
		setBooleanProp($target, name, value)
	} else {
		$target.setAttribute(name, value);
	}

}

function isCustomProp(name) {
	return false;
}

function setBooleanProp($target, name, value) {
	if (value) {
		$target.setAttribute(name, value);
		$target[name] = true;
	} else {
		$target[name] = false;
	}
}

function setProps($target, props) {
	Object.keys(props).forEach(name => {
		setProp($target, name, props[name]);
	});
}

/* beautify preserve:start */
const a = (
  <ul>
    <li>item 1</li>
    <li>item 2</li>
  </ul>
);

const b = (
  <ul>
    <li>item 1</li>
    <li>Hello</li>
  </ul>
);
/* beautify preserve:end */

console.log(a, b);
const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateElement($root, a);

$reload.addEventListener('click', () => {
	updateElement($root, b, a);
});