function toArray(args) {
  return [].slice.call(args);
}

//curry::(x, y ,n...) -> (x) -> (y) -> (n..)
function curry(fn) {
  var len = fn.length;
  var args = [];
  return function next() {
    args = args.concat(toArray(arguments));
    return (args.length >= len) ? 
      fn.apply(this, args.splice(0)) : 
      next;
  }
}

//first::([a]) -> a
const first = xs => xs[0]

//rest::([a]) -> [a]
const rest = ([x, ...xs]) => xs

//reduce::(f, a, [b]) -> a
const reduce = (f, acc, xs) =>
  xs.length === 0
    ? acc
    : reduce(f, f(acc, first(xs)), rest(xs))

/*-------------------------------------Algunos catamorfismos comunes-------------------------------------------*/

//sum::([a]) -> a
const sum = xs => reduce((acc,el) => el + acc, 0, xs)

//reverse::([a]) -> [a]
const reverse = xs => reduce((acc, el) => [el].concat(acc), [], xs)

//map::(f,[a]) -> [b]
const map = (f, xs) => reduce((acc,x) => acc.concat(f(x)), [], xs )

//filter::(f,[a]) -> [a]
const filter = (f, xs) => reduce((acc, el) => f(el) ? acc.concat(el) : acc, [], xs)

//all:(f,[a]) -> Boolean
const all = (f, xs) => reduce((acc, x) => f(x) & acc ? true : false, true, xs )

//any:(f,[a]) -> Boolean
const any = (f,xs) => reduce((acc,x) => f(x) ? true : acc , false, xs)

//size::([a]) -> Integer
const size = xs => reduce((acc, x) => 1 + acc , 0, xs)

//max::([a]) -> a
const max = (xs) => reduce((acc, el) => el > acc ? el : acc, 0, xs)

//min::([a]) -> a
const min = (xs) => reduce((acc, el) => el < acc ? el : acc, Infinity , xs)


/*-------------------------------------Fin de catamorfismos comunes-------------------------------------------*/


//id::x -> x
const id = x => x

//compose::(f,g) -> ()
const compose = curry((f,g) => x => f(f(x)))

//map::f -> F -> F
const map = curry((f,F) => F.map(f))

//chain::(f, M) -> M
const chain = curry((f, m) => m.chain(f))

const Right = x => ({
  x,
  map: f => Right(f(x)),
  chain: f => f(x),
  fold: (_,r) => r(x),
  inspect: () => `Right(${x})`
})

const Left = x => ({
  x,
  map: f => Left(x),
  chain: f => f(x),
  fold: (l,_) => l(x),
  inspect: () => `Left(${x})`
})

const Either = {}
//Either.of:: x ~> Either x
Either.of = x => x == null ? Left(null) : Right(x)

//fromNullable:: x ~> Either x
const fromNullable = Either.of

const Just = x => ({
  x,
  map: f => Just(f(x)),
  chain: f => f(x),
  inspect: () => `Just(${x})`
})

const Nothing = x => ({
  x,
  map: f => Nothing(x),
  chain: f => f(x),
  inspect: () => `Nothing(${x})`
})
const Maybe = {}
//Maybe.of:: x ~> Maybe x
Maybe.of = x => x != null ? Just(x) : Nothing(null)

const IO = f => ({
  runIO: f,
  map: fn => map(fn, runIO),
  inspect: () => `IO(${runIO})`
})
//IO.of:: fn -> IO fn
IO.of = fn => IO(fn)

module.exports = {
  first,
  rest,
  reduce,
  sum,
  reverse,
  map,
  filter,
  all,
  any,
  size,
  max,
  min,
  curry,
  chain,
  id,
  compose,
  map,
  Either,
  Right,
  Left,
  Maybe,
  Just,
  Nothing,
  IO
}
