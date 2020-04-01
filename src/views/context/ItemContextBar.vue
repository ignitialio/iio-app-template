<template>
  <div class="itemctx-layout">
    <div style="flex: 1"></div>

    <v-btn v-if="backPath" icon dark @click="$router.push(backPath)">
      <v-icon>arrow_back</v-icon>
    </v-btn>

    <div class="itemctx-divider"></div>

    <v-btn icon :title="$t('Load schema')" @click="handleSchemaLoad">
      <v-icon color="grey lighten-1">vertical_align_top</v-icon>
    </v-btn>

    <div class="itemctx-divider"></div>

    <v-btn icon light :title="$t('Save item')" @click="handleItemSave"
      :disabled="!modified">
      <v-icon color="green lighten-1">save</v-icon>
    </v-btn>

    <div class="itemctx-divider"></div>
  </div>
</template>

<script>
export default {
  name: 'ig-itemctx',
  data: () => {
    return {
      modified: false,
      backPath: ''
    }
  },
  methods: {
    handleItemSave() {
      this.$services.emit('view:item:save')
    },
    handleItemModified(status) {
      this.modified = status
    },
    handleSchemaLoad() {
      this.$services.emit('view:schema:load')
    },
    handleBackPath(backPath) {
      this.backPath = backPath
    }
  },
  mounted() {
    this._listeners = {
      onItemModified: this.handleItemModified.bind(this),
      onBackPath: this.handleBackPath.bind(this)
    }

    this.$services.on('view:item:modified', this._listeners.onItemModified)
    this.$services.on('view:item:back', this._listeners.onBackPath)

    this.$services.emit('view:item:ready')
  },
  beforeDestroy() {
    this.$services.off('view:item:modified', this._listeners.onItemModified)
    this.$services.off('view:item:back', this._listeners.onBackPath)
  }
}
</script>

<style scoped>
.itemctx-layout {
  width: full;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.itemctx-divider {
  height: 32px;
  border-left: 1px solid gainsboro;
}

@media screen and (max-width: 800px) {

}
</style>
