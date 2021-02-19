// 实现jquery对象继承，支持深拷贝
export function extend(...args: any[]) {
  const extended: any = {}
  let deep = false
  let i = 0
  const length = args.length

  if (Object.prototype.toString.call(args[0]) === '[object Boolean]') {
    deep = args[0]
    i++
  }

  function merge(obj: any) {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop])
        } else {
          extended[prop] = obj[prop]
        }
      }
    }
  }

  for (; i < length; i++) {
    var obj = args[i]
    merge(obj)
  }

  return extended
}
