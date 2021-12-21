

function putButtons() {
    values.forEach(v => {
        let node = document.createElement('button');
        node.setAttribute('width', `${ FOOD_WIDTH }px`)
        document.getElementsByTagName('body')[0].appendChild(node)
    })

}