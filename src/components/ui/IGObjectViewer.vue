<template>
  <div v-if="schema._meta && !schema._meta.hidden && showIf(schema._meta.showIf)"
    class="ig-object-viewer">

    <div v-if="isObjectId(value) || isPrimitive(value) || value === null"
      class="ig-objv-content">
      <div class="ig-objv-items threequarter">
        <!-- enum selection with component -->
        <component v-if="schema.enum && schema._meta.component"
          :label="$t(schema.title || name)"
          :is="schema._meta.component.name"
          :items="translatedArray(schema.enum)"
          :properties="schema._meta.component.properties"
          :value="value"/>

        <!-- enum -->
        <div v-else-if="schema.enum" class="ig-objv-raw">
          <div class="ig-objv-left">{{ $t(schema.title || name) }}</div>
          <div class="ig-objv-right">{{ $t(value) }}</div>
        </div>

        <!-- boolean -->
        <div v-else-if="schema.type === 'boolean'" class="ig-objv-raw">
          <div class="ig-objv-left">{{ $t(schema.title || name) }}</div>
          <div class="ig-objv-right">{{ value ? $t('Yes') : $t('No') }}</div>
        </div>

        <!-- Image field -->
        <div v-else-if="schema._meta && schema._meta.type === 'image'"
          class="ig-objv-raw">
          <div class="ig-objv-left">{{ $t(schema.title || name) }}</div>
          <img ref="imageField"
            style="width: 64px; height: 64px; border: 1px solid gainsboro; margin-right: 8px;"
            :src="imageSrc"/>
        </div>

        <!-- File field -->
        <div v-else-if="schema._meta && schema._meta.type === 'file'" 
          class="ig-objv-raw">
          <div class="ig-objv-left">{{ $t(schema.title || name) }}</div>
          <div class="ig-objv-right">{{ value }}</div>
        </div>

        <!-- Date time field -->
        <div v-else-if="schema._meta && schema._meta.type && schema._meta.type.match(/date|time/)" 
          class="ig-objv-raw">
          <div class="ig-objv-left">{{ $t(schema.title || name) }}</div>
          <div class="ig-objv-right">{{ new Date(value).toLocaleString() }}</div>
        </div>

        <!-- Source code -->
        <div class="ig-objv-editor"
          v-else-if="schema._meta && schema._meta.type && schema._meta.type === 'code'"
          :style="'height: ' + (schema._meta.height || '300px')">
          <div style="margin-left: -25%; font-weight: bold;">{{ schema.title }}</div>
          <prism-editor ref="editor" class="ig-objv-editor--content"
            lineNumbers :code="value" readonly
            :language="schema._meta.language || 'js'"></prism-editor>
        </div>

        <!-- color -->
        <div class="ig-objv-selector"
          v-else-if="schema._meta && schema._meta.type === 'color'">
          <label style="margin-right: 4px;">{{ $t(schema.title || name) }}</label>
          <ig-color-picker :value="value" readonly/>
        </div>

        <!-- else -->
        <div v-else class="ig-objv-raw">
          <div class="ig-objv-left">{{ $t(schema.title || name) }}</div>
          <div class="ig-objv-right">{{ value }}</div>
        </div>
      </div>
    </div>

    <!-- next level: is Object, but not geopoint -->
    <div class="ig-objv-next"
      v-for="(prop, index) in objProperties(properties)" :key="index">
      <div v-if="(value[prop] !== null && !isObjectId(value[prop])) && !isPrimitive(value[prop]) && !schema.properties[prop]._meta.hidden && showIf(schema.properties[prop]._meta.showIf)"
        class="ig-objv-next-header">
        <div class="ig-objv-next-header--text">
          {{ schema.properties[prop] ? $t(schema.properties[prop].title) : $t(prop) }}</div>
      </div>

      <ig-object-viewer :name="prop"
        :schema="schema.properties[prop]"
        class="ig-objv-next-form"
        :value="value[prop]" :root="root"></ig-object-viewer>
    </div>

    <!-- next level: is Array -->
    <div v-if="value && schema.type === 'array'"
      class="ig-objv-next">
      <div v-if="schema._meta.type === 'datagrid' && showIf(schema.items._meta.showIf)">
        <v-data-table class="form-grid" hide-default-footer
          :sort-by="dataColumns"
          multi-sort
          :headers="dataGridHeaders"
          :items="value"
          :no-data-text="$t('No data available')">

          <template v-for="prop in dataGridHeaders" v-slot:item[props]="{ item }">
            {{ formattedItem(item[prop.value], schema.items.properties[prop.value].format) }}
          </template>
        </v-data-table>
      </div>

      <div v-if="schema._meta.type !== 'datagrid' &&
        !Array.isArray(schema.items) && schema.items.type !== 'object' &&
        showIf(schema.items._meta.showIf)">
        <ig-object-viewer
          v-for="(item, index) in value" :key="index"
          :name="$t(schema.items.title || schema.items[index].name)"
          :schema="schema.items"
          class="ig-objv-next-object"
          :value="item"
          @remove="handleRemove(index)"
          :root="root"></ig-object-viewer>
      </div>

      <div v-if="schema._meta.type !== 'datagrid' &&
        schema.items.type === 'object' && schema.items !== undefined &&
        showIf(schema.items._meta.showIf)">
        <ig-object-viewer
          v-for="(item, index) in value" :key="index"
          :name="$t(schema.items.title || schema.items[index].name) + '[' + index + ']'"
          :schema="schema.items"
          class="ig-objv-next-object"
          :value="item"
          @remove="handleRemove(index)"
          :root="root"></ig-object-viewer>
      </div>

      <ig-object-viewer v-if="schema._meta.type !== 'datagrid' &&
        itemSchema && Array.isArray(schema.items) &&
        showIf(itemSchema._meta.showIf)"
        v-for="(itemSchema, index) in schema.items" :key="index"
        :name="$t(itemSchema.title || itemSchema.name)"
        :schema="itemSchema"
        class="ig-objv-next-object"
        :value="value[index]"
        @remove="handleRemove(index)"
        :root="root"></ig-object-viewer>
    </div>

    <div v-if="schema._meta.type === 'geopoint'"
      class="ig-objv-geo">
      <ig-geo v-if="schema._meta.type === 'geopoint'" :height="400"
        :marker="value" @update:marker="handleGeoloc"/>
    </div>
  </div>
</template>

<script>
import map from 'lodash/map'
import cloneDeep from 'lodash/cloneDeep'
import ss from 'socket.io-stream'
import jsonpath from 'jsonpath'

export default {
  name: 'ig-object-viewer',
  props: {
    name: {
      type: String
    },
    value: {},
    schema: {
      type: Object
    },
    root: {
      type: Object
    }
  },
  watch: {
    'schema.enum': function(val) {
      if (this.$refs.settings) {
        this.$refs.settings.$forceUpdate()
      }
    }
  },
  data: () => {
    return {
      selectionDialog: false,
      error: false,
      /* populate selection list with helpers */
      listFromFunctionItems: [],
      /* bug on boolean value */
      booleanValue: false,
      /* data picker menu */
      datepickerMenu: false
    }
  },
  methods: {
    /* bug on v-switch */
    handleBooleanValue() {
      this.booleanValue = this.value
    },
    _updateI18N(schema) {
      if (schema._meta && schema._meta.i18n) {
        this.$i18n.addTranslations(schema._meta.i18n)
      }
    },
    translatedArray(arr) {
      return map(arr, e => {
        return {
          text: this.$t(e),
          value: e
        }
      })
    },
    isObjectId(obj) {
      let isObjectId = obj ? obj._bsontype === 'ObjectID' : false

      return isObjectId
    },
    isPrimitive(obj) {
      return (!(typeof obj === 'object') || (obj instanceof Date)) && !Array.isArray(obj)
    },
    handleInput(val) {
      this.$emit('input', val)
    },
    handlePropInput(prop, val) {
      let rVal = cloneDeep(this.value)
      rVal[prop] = val
      this.$emit('input', rVal)
    },
    handleItemInput(index, val) {
      let rVal = cloneDeep(this.value)
      rVal[index] = val
      this.$emit('input', rVal)
    },
    handleSwitchChange(event) {
      this.$emit('input', event || false)
    },
    handleGeoloc(val) {
      console.log('GEOLOC', val)
      if (this._schema.type === 'object') {
        this.$emit('input', {
          latitude: val[1],
          longitude: val[0]
        })
      } else {
        this.$emit('input', val)
      }
    },
    /* adds item to an array generating fake data */
    handleAddItem() {
      let data = this.$utils.generateDataFormJSONSchema(this.schema).json
      let arr = this.value.concat([ data[0] ])

      this.$emit('input', arr)
    },
    /* detect removal request */
    handleRemoveItem() {
      this.$emit('remove')
    },
    /* proceeds to removal request */
    handleRemove(index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    handleFileLoad(data) {
      try {
      } catch (err) {
        console.log(err)
      }
    },
    handleFileError(err) {
      this.$services.emit('app:notification', this.$t(err))
      this.error = true
    },
    handleFileInput(file) {
      this.file = file
      this.error = false
      let filename = this.file.name + '-' + this.$utils.uuid()

      if (this.schema._meta.public) filename += '_public'

      let handler = result => {
        if (result.err) {
          console.log('error', result)
          this.$emit('input', '/api/s3/' + filename)
          this.$services.emit('app:notification', this.$t('failed to upload file'))
          this.error = true
        } else {
          this.$ws.socket.off('ws:file:upload:result', handler)
          this.$emit('input', '/api/s3/' + filename)

          console.log('file uploaded', filename)
        }
      }

      this.$ws.socket.on('ws:file:upload:result', handler)

      let stream = ss.createStream()

      // upload a file to the server.
      ss(this.$ws.socket).emit('ws:file:upload', stream, {
        name: filename,
        size: this.file.size,
        bucket: this.$config.store.bucket.name
      })

      let blobStream = ss.createBlobReadStream(this.file)

      let size = 0

      blobStream.on('data', chunk => {
        size += chunk.length
        this.file.progress = parseInt(size / this.file.size * 100)
      })

      blobStream.pipe(stream)
    },
    handleExternalSelectionDialog() {
      this.selectionDialog = true

      let onSelect = data => {
        if (this.schema._meta.selection.field) {
          this.$emit('input', data[this.schema._meta.selection.field])
        } else {
          this.$emit('input', data)
        }

        this.selectionDialog = false
      }

      this.$services.once(this.schema._meta.selection.event, onSelect)
    },
    listFromFunctionHelper(fct, params, paramValue, text) {
      params = map(params, e => jsonpath.query(this.root, e)[0])
      if (paramValue) {
        params[paramValue.index] = paramValue.value
      }

      let result = this.$helpers[fct].apply(this,  params)
      if (typeof result.then == 'function') {
        result.then(r => {
          if (text) {
            r = map(r, e => {
              text.match =
                text.match.replace(/\$\.(.*)/g, m => jsonpath.query(this.root, m)[0])
              text.value =
                text.value.replace(/\$\.(.*)/g, m => jsonpath.query(this.root, m)[0])

              return {
                text: e.replace(text.match, text.value),
                value: e
              }
            })
          }

          this.listFromFunctionItems = r
        }).catch(err => console.log(err))
      } else {
        if (text) {
          result = map(result, e => {
            text.match =
              text.match.replace(/\$\.(.*)/g, m => jsonpath.query(this.root, '$.' + m)[0])
            text.value =
              text.value.replace(/\$\.(.*)/g, m => jsonpath.query(this.root, '$.' + m)[0])

            return {
              text: e.replace(text.match, text.value),
              value: e
            }
          })
        }

        this.listFromFunctionItems = result
      }
    },
    objProperties(properties) {
      let result = []

      if (this.value && !this.isPrimitive(this.value) &&
        this.schema.properties && this.schema.type !== 'array' &&
        this.schema._meta.type !== 'geopoint') {

        for (let prop of properties) {
          if (this.schema.properties[prop]) result.push(prop)
        }
      }

      return result
    },
    showIf(showIf) {
      let check = item => {
        let value = jsonpath.query(this.root, item.jsonpath)[0]

        switch (item.condition) {
          case 'eq': return value === item.value
          case 'neq': return value !== item.value
          case 'gte': return value >= item.value
          case 'gt': return value > item.value
          case 'lte': return value <= item.value
          case 'lt': return value < item.value
        }
      }

      if (showIf) {
        if (Array.isArray(showIf)) {
          let result = check(showIf[0])
          for (let i = 1; i < showIf.length; i++) {
            if (showIf[i].operator) continue
            if (showIf[i - 1].operator) {
              switch (showIf[i - 1].operator) {
                case '&&':
                  result = result && check(showIf[i])
                  break
                case '||':
                  result = result || check(showIf[i])
                  break
              }
            }
          }

          return result
        } else {
          return check(showIf)
        }
      }

      return true
    },
    formattedItem(value, format) {
      console.log(value, format)
      switch (format) {
        case 'currency': return value.toFixed(2)
      }

      return value
    }
  },
  async beforeMount() {
    if (!this.schema) {
      console.error('!!! no schema', this.name, global.$j(this.value))
    }

    this._updateI18N(this.schema)
    this._schema = cloneDeep(this.schema)
    this._schema._meta = this._schema._meta || { type: null }
    // console.log(this.name, global.$j(this._schema))
  },
  mounted() {
    // future use: sets root component for all
    if (this.$parent) {
      if (this.$parent.$options._componentTag === 'ig-object-viewer') {
        this._formRootElement = this.$parent._formRootElement
      } else {
        this._formRootElement = this.$parent.$el
      }
    }

    // vuetify issue with code tag
    setTimeout(() => {
      if (this.$refs.editor) {
        let code = this.$refs.editor.$el.getElementsByTagName('code')[0]
        code.style.boxShadow = 'none'
      }
    }, 500)

    // helpers
    if (this.schema._meta && this.schema._meta.selection &&
      this.schema._meta.selection.list) {
      let params = this.schema._meta.selection.params
      this.listFromFunctionHelper(this.schema._meta.selection.list,
        params, undefined, this.schema._meta.selection.text)

      for (let p = 0; p < params.length; p++) {
        this.$watch(params[p].replace('$', 'root'), function (val) {
          let paramValue = { index: p, value: val }
          this.listFromFunctionHelper(this.schema._meta.selection.list,
            params,
            paramValue,
            this.schema._meta.selection.text)
        })
      }
    }

    this.$forceUpdate()
  },
  computed: {
    properties() {
      if (this.value && (typeof this.value === 'object' || Array.isArray(this.value))) {
        return Object.keys(this.value)
      }

      return []
    },
    isReadOnly() {
      return !!this.schema.readOnly
    },
    fileProgress() {
      if (this.file) {
        return this.file.progress
      }

      return null
    },
    imageSrc() {
      if (this.value.match(/png|jpg|jpeg|gif/)) {
        if (this.value.match(/\$\$/)) {
          let serviceName = this.value.match(/\$\$service\((.*?)\)\/(.*)/)[1]
          if (this.$services[serviceName]) {
            (async () => {
              await this.$utils.waitForProperty(this.$refs, 'imageField')
              let el = this.$refs.imageField
              this.$utils.fileUrl(this.value, 'assets/icons/cube.png', el)
            })()
            return ''
          } else {
            return 'assets/icons/cube.png'
          }
        } else {
          return this.$utils.fileUrl(this.value, 'assets/icons/cube.png')
        }
      } else {
        return 'assets/icons/cube.png'
      }
    },
    dataGridHeaders() {
      let headers = Object.keys(this.schema.items.properties)
      headers = headers.map(e => {
        return { text: this.$t(this.schema.items.properties[e].title), value: e }
      })
      return headers
    },
    dataColumns() {
      let columns = Object.keys(this.schema.items.properties)
      return columns
    }
  }
}
</script>

<style scoped>
.ig-object-viewer {
  height: calc(100% - 0px);
  display: flex;
  flex-flow: column;
  position: relative;
  overflow-x: hidden;
}

.ig-object-viewer.required {
  border-right: 1px solid tomato;
}

.ig-objv-content {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.ig-objv-next {
  width: 100%;
  display: flex;
  flex-flow: column;
}

.ig-objv-next-header {
  display: flex;
  align-items: center;
}

.ig-objv-next-header--text {
  margin: 16px 0px;
  font-weight: bold;
}

.ig-objv-next-header--actions {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.ig-objv-next-form {
  width: calc(100% - 10px);
  margin: 2px 2px 2px 8px;
  border: 1px solid rgba(100, 100, 100, 0.1);
  padding: 2px 4px;
}

.ig-objv-next-object {
  margin-left: 8px;
  width: calc(100% - 8px);
  border: 1px solid rgba(100, 100, 100, 0.1);
}

.ig-objv-geo {
  width: 100%;
  display: flex;
  flex-flow: column;
}

.ig-objv-meta {
  width: 25%;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.ig-objv-hgroup {
  display: flex;
  align-items: center;
}

.ig-objv-items.half {
  width: 50%;
}

.ig-objv-items.threequarter {
  width: 75%;
}

.ig-objv-rmbut {
  position: absolute;
  top: 4px;
  left: -48px;
  z-index: 100;
}

.ig-objv-editor {
  position: relative;
  width: 100%;
}

.ig-objv-editor--content {
  position: absolute;
  top: 0;
  left: 0;
}

/* does not work since dynamic update by Vuetify */
.ig-objv-editor--content code {
  -webkit-box-shadow: none;
  box-shadow: none!important;
}

.ig-objv-selector {
  width: 100%;
  display: flex;
  align-items: center;
}

.ig-objv-raw {
  display: flex;
}

.ig-objv-left {
  width: 50%;
  text-align: right;
  padding: 0 16px;
  background-color: slategray;
  color: white;
}

.ig-objv-right {
  width: 50%;
  text-align: left;
  padding: 0 16px;
}

@media screen and (max-width: 600px) {

}
</style>
