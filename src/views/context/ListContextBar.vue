<template>
  <div class="listctx-layout">
    <v-icon class="search-icon">search</v-icon>
    <input :placeholder="$t('Search')" v-model="search"/>

    <div style="flex: 1"></div>

    <div class="title">{{ collection }}</div>

    <div class="divider"></div>

    <v-btn icon :title="$t('Add item')" @click="handleItemAdd">
      <v-icon color="grey lighten-1">add</v-icon>
    </v-btn>

    <ig-fileinput button loadToBrowser color="grey lighten-1"
      :title="$t('Load item')" @load="handleItemLoad"/>

    <div class="divider"></div>
  </div>
</template>

<script>
export default {
  name: 'ig-listctx',
  data: () => {
    return {
      collection: '',
      search: ''
    }
  },
  watch: {
    search: function(val) {
      this.$services.emit('view:list:search', val)
    }
  },
  methods: {
    handleItemAdd() {
      this.$services.emit('view:list:add')
    },
    handleItemLoad(data) {
      this.$services.emit('view:list:loaded', data)
    },
    handleCollection(collection) {
      this.collection = collection
    }
  },
  mounted() {
    this._listeners = {
      onCollection: this.handleCollection.bind(this)
    }

    this.$services.on('view:list:collection', this._listeners.onCollection)

    this.$services.emit('view:list:ready')
  },
  beforeDestroy() {
    this.$services.off('view:list:collection', this._listeners.onCollection)
  }
}
</script>

<style scoped lang="scss">
.listctx-layout {
  width: 100%;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .search-icon {
      color: dimgray;
  }

  input {
    outline: none;
    color: dimgray;
    border-bottom: 1px solid dimgrey;
  }

  .search:focus {
    border-bottom: 1px solid dodgerblue;
  }

  .divider {
    height: 32px;
    border-left: 1px solid dimgrey;
  }

  .title {
    margin-right: 16px;
    color: dimgray;
  }
}

.theme--dark .listctx-layout {
  .search-icon {
    color: gainsboro;
  }

  input {
    color: gainsboro;
    border-bottom: 1px solid gainsboro;
  }

  .title {
    color: gainsboro;
  }

  .divider {
    border-left: 1px solid gainsboro;
  }
}

@media screen and (max-width: 800px) {

}
</style>
