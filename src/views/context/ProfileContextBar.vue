<template>
  <div class="profilectx-layout">
    <div style="flex: 1"></div>

    <div class="profilectx-divider"></div>

    <v-btn icon :title="$t('Save')" @click="handleItemSave"
      :disabled="!modified">
      <v-icon color="green lighten-1">check</v-icon>
    </v-btn>

    <div class="profilectx-divider"></div>
  </div>
</template>

<script>
export default {
  name: 'profile-ctx',
  data: () => {
    return {
      modified: false
    }
  },
  watch: {
  },
  methods: {
    handleItemSave() {
      this.$services.emit('view:profile:save')
    },
    handleItemModified(status) {
      this.modified = status
    }
  },
  mounted() {
    this._listeners = {
      onItemModified: this.handleItemModified.bind(this)
    }

    this.$services.on('view:profile:modified', this._listeners.onItemModified)
  },
  beforeDestroy() {
    this.$services.off('view:profile:modified', this._listeners.onItemModified)
  }
}
</script>

<style scoped>
.profilectx-layout {
  width: full;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.profilectx-divider {
  height: 32px;
  border-left: 1px solid gainsboro;
}

@media screen and (max-width: 800px) {

}
</style>
