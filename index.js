const f = require('./funny.js')
var lista=  [1,2,3]
console.log(lista+ " probando lista ")
console.log(f.sum(lista) +" probando sum")

console.log(f.rest(lista) + " probando rest")

console.log(f.max(lista)+ " probando max")

const f_aux = x => {
    console.log(x, "probando map ")
    return x+1
}
console.log(f.map(f_aux,lista))


console.log(f.IO.of(lista))