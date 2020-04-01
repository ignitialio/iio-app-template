function findTranslations(i18n, obj) {
  let keys

  if (obj && typeof obj === 'object') {
    keys = Object.keys(obj)
  } else if (Array.isArray(obj)) {
    keys = Array(obj.length).map((v, i) => i)
  } else {
    return
  }

  for (let p of keys) {
    if (obj[p] && obj[p].i18n) {
      i18n.addTranslations(obj[p].i18n)
    }

    if (typeof obj[p] === 'object') {
      findTranslations(i18n, obj[p])
    } else if (Array.isArray(obj[p])) {
      findTranslations(i18n, obj[p])
    }
  }
}

export function loadSchema(vueObjRef, collection) {
  return new Promise((resolve, reject) => {
    vueObjRef.$utils.waitForProperty(vueObjRef, '$db').then(db => {
      db.collection('schemas').then(async schemas => {
        let schema = await schemas.dGet({ name: collection })

        if (schema) {
          // manage naming restrictions for Mongo
          schema.$schema = schema._schema
          delete schema._schema
          findTranslations(vueObjRef.$i18n, schema)

          resolve(schema)
        } else {
          // console.log('/data/schemas/' + collection + '.schema.json')
          fetch('/data/schemas/' + collection + '.schema.json')
            .then(response => {
              console.log(response)
              response.json().then(async data => {
                // console.log(data)
                data._schema = data.$schema
                delete data.$schema
                findTranslations(vueObjRef.$i18n, schema)
                await schemas.dPut(data)
                resolve(data)
              }).catch(err => {
                console.log(err)
                reject(new Error('bad for collection [' + collection + ']'))
              })
            }).catch(err => {
              console.log(err)
              reject(new Error('no schema for collection [' + collection + ']'))
            })
        }
      }).catch(err => reject(err))
    }).catch(err => reject(err))
  })
}

export function jsonDocNormalize(doc) {
  if (!doc) return doc

  let keys = Object.keys(doc)

  if (keys) {
    for (let k of keys) {
      if (k.match(/^\$/)) {
        doc[k.replace('$', '_')] = doc[k]
        delete doc[k]
        k = k.replace('$', '_')
      }

      if (typeof doc[k] === 'object') {
        doc[k] = jsonDocNormalize(doc[k])
      }
    }
  }

  return doc
}