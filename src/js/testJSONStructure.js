export default function testJSONStructure (json, data) {
  return new Promise((resolve, reject) => {
    const finalResult = {}
    const errorResult = []
    const path = []
    parseJSON(json, data, path, finalResult, errorResult)
    resolve({finalResult, errorResult})    
  })
}

function parseJSON (json, data, path, result, errorResult) {
  for (var key in json) {
    // 1. Check if the same exists in data
    const keyExists = ( data[key] || data[key] === 0 ) ? true : false
    result[key] = {
      data: data[key],
      found: keyExists,
      path: path
    }

    if (!keyExists) { 
      errorResult.push({
        path: path,
        message: `${key} not found`
      })
      continue
    }

    // Check type
    let typeMatched
    switch (json[key].type) {
      case 'String':
        typeMatched = (typeof data[key] === 'string') ? true : false
        break
      case 'Array':
        typeMatched = Array.isArray(data[key]) ? true : false
        break
      case 'Object':
        typeMatched = (typeof data[key] === 'object') ? true : false
        break
      case 'Number':
        typeMatched = (typeof data[key] === 'number') ? true : false
        break
      case 'Enum':
        const value = data[key]
        const possibleValues = json[key].possibleValues
        if (Array.isArray(possibleValues)) {
          typeMatched = (possibleValues.indexOf(value) !== -1)
        }
        break
      case 'Constant':
        const currentValue = data[key]
        const expectedValue = json[key].expectedValue
        typeMatched = (currentValue === expectedValue)
        break
    }

    result[key] = Object.assign({}, result[key], {
      typeExpected: json[key].type,
      typeMatched: typeMatched
    })

    if (!typeMatched) {
      errorResult.push({
        path: path,
        message: `${key} type not matched`
      })      
    }

    // Iterating through the nested keys if Array
    if ( 
      json[key].type === 'Array' && 
      json[key].value && 
      typeMatched 
    ) {
      result[key].value = []
      for (let i = 0; i < data[key].length; i++) {
        const newPath = path.slice(0)
        newPath.push(`${key}[${i}]`)
        result[key].value[i] = {}

        parseJSON(json[key].value, data[key][i], newPath, result[key].value[i], errorResult)
      }
    }

    // Iterating through the nested keys if Object
    if (
      json[key].type === 'Object' && 
      json[key].value && 
      typeMatched
    ) {
      const newPath = path.slice(0)
      newPath.push(key)
      result[key].value = {}

      parseJSON(json[key].value, data[key], newPath, result[key].value, errorResult)
    }
  }
}
