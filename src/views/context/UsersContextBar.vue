<template>
  <div class="usersctx-layout">
    <div class="usersctx-search-section">
      <v-icon color="grey">search</v-icon>
      <input
        class="usersctx-search"
        :placeholder="$t('Search')" v-model="search"/>
    </div>

    <div style="flex: 1"></div>

    <div class="usersctx-divider"></div>

    <v-btn icon :title="$t('Add item')" @click="handleItemAdd">
      <v-icon color="green darken-1">add</v-icon>
    </v-btn>

    <div class="usersctx-divider"></div>
  </div>
</template>

<script>
export default {
  name: 'ig-usersctx',
  data: () => {
    return {
      search: ''
    }
  },
  watch: {
    search: function(val) {
      this.handleSearch(val)
    }
  },
  methods: {
    handleItemAdd() {
      this.$services.emit('view:users:add')
    },
    handleSearch(val) {
      this.$services.emit('view:users:search', val)
    }
  },
  mounted() {
    this.$services.emit('view:users:ready')
  },
  beforeDestroy() {

  }
}
</script>

<style scoped>
.usersctx-layout {
  width: 100%;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.usersctx-search {
  outline: none;
  color: dimgray;
  border-bottom: 1px solid gainsboro;
}

.usersctx-search:focus {
  border-bottom: 1px solid dodgerblue;
}

.usersctx-divider {
  height: 32px;
  border-left: 1px solid gainsboro;
}

.usersctx-title {
  margin-right: 16px;
}

.theme--light .usersctx-title {
  color: dimgray;
}

.theme--dark .usersctx-title {
  color: dimgray;
}

@media screen and (max-width: 600px) {
  .usersctx-search-section {
    display: none;
  }
}
</style>
