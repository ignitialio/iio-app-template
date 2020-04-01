<template>
  <div class="users-layout">
    <div class="users-left-panel">
      <v-progress-linear v-if="loading"
        indeterminate class="users-progress-bar"></v-progress-linear>

      <v-list class="list">
        <v-list-item v-for="(item, index) in itemsData" :key="index"
          @click.stop="handleSelect(item)"
          @dblclick.stop="handleSelect(item, 'dblclick')"
          style="border-bottom: 1px solid gainsboro;"
          :class="{ 'selected': selected === item }">
          <v-list-item-avatar>
            <v-img :src="$utils.fileUrl(item.picture,'assets/item.png')" alt=""></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.firstname + ' ' + item.lastname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ item.login.username }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <ig-btn-confirm icon="clear" small color='red darken-1'
              class="cart-product-remove" @click="handleDelete(item)">
              <v-icon>clear</v-icon>
            </ig-btn-confirm>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>

    <div class="users-right-panel">
      <ig-form v-if="!!selected && !!schema"
        v-model="selected" name="user" :schema.sync="schema">
      </ig-form>
    </div>
  </div>
</template>

<script>
import concat from 'lodash/concat'
import slice from 'lodash/slice'
import filter from 'lodash/filter'
import { loadSchema } from '../commons'

export default {
  data: () => {
    return {
      selected: null,
      itemsData: [],
      loading: false,
      schema: null
    }
  },
  watch: {
  },
  methods: {
    handleScroll(event) {
      let element = event.target

      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.showNextElements()
      }
    },
    showNextElements() {
      this.loading = true
      this.items = concat(this.items,
        slice(this.itemsData, this.nextIndex, this.nextIndex + 100))
      this.nextIndex += 100
      setTimeout(() => { this.loading = false }, 500)
    },
    handleSelect(item, dblclick) {
      this.selected = item
    },
    handleDelete(item) {
      if (item._id) {
        this.$db.collection('users').then(items => {
          items.dDelete(item).then(result => {
            console.log('deleted', item._id)
            this.update()
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    },
    handleSearch(data) {
      this.update(data)
    },
    handleAddUser() {
      let item = (this.$utils.generateDataFormJSONSchema(this.schema)).json

      this.$store.commit('param', item)

      this.$router.push({
        path: '/profile',
        query: { add: true }
      })
    },
    update(queryFilter) {
      loadSchema(this, 'users').then(schema => {
        this.schema = schema
      }).catch(err => {
        this.$services.emit('view:user:editable', false)
        console.log(err)
      })

      this.items = []
      this.$db.collection('users').then(items => {
        items.dFind({}).then(docs => {
          this.itemsData = docs
          this.nextIndex = 0

          if (queryFilter) {
            this.itemsData = filter(this.itemsData, e => {
              return !!JSON.stringify(e).match(queryFilter)
            })
          }

          this.showNextElements()
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
  },
  mounted() {
    // show contextual menu bar
    this.$services.emit('app:context:bar', 'users-ctx')

    this._listeners = {
      onSearch: this.handleSearch.bind(this),
      onAddUser: this.handleAddUser.bind(this)
    }

    let listEl = this.$el.getElementsByClassName('list')[0]
    listEl.addEventListener('scroll', this.handleScroll.bind(this))

    this.update()

    this.$services.on('view:users:search', this._listeners.onSearch)
    this.$services.on('view:users:add', this._listeners.onAddUser)

    this.$services.once('view:users:ready', () => {
    })
  },
  beforeDestroy() {
    this.$services.emit('app:context:bar', null)

    this.$services.off('view:users:search', this._listeners.onSearch)
    this.$services.off('view:users:add', this._listeners.onAddUser)
  }
}
</script>

<style>
.users-layout {
  display: flex;
  z-index: 0;
  width: 100%;
  height: calc(100% - 0px);
  padding-top: 8px;
}

.users-left-panel {
  width: 33%;
  height: calc(100% - 0px);
  overflow-y: auto;
}

.users-progress-bar {
  position: absolute;
  width: 100%;
}

.users-right-panel {
  flex: 1;
  height: calc(100% - 0px);
  padding-left: 8px;
  overflow-y: auto;
}

.users-json-viewer {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .users-left-panel {
    width: calc(100% - 4px);
    height: calc(100% - 0px);
    overflow-y: auto;
    margin: 2px;
  }

  .users-right-panel {
    display: none;
  }
}
</style>
