<template>
  <v-btn :text="text" :icon="!!icon"
    :small="small" :absolute="absolute" :color="color"
    @click.stop.prevent="handleClick">
    <v-icon v-if="icon"
      @mouseup.prevent.stop="handleMouseUp"
      @mousedown.prevent.stop="handleMouseDown"
      @click.prevent.stop="handleClick">{{ icon }}</v-icon>
    <div v-else>{{name}}</div>
  </v-btn>
</template>

<script>
export default {
  props: {
    name: String,
    text: Boolean,
    icon: String,
    small: Boolean,
    color: String,
    absolute: Boolean
  },
  methods: {
    handleClick(e) {
      this.timeout = setTimeout(() => {
        this.$el.classList.remove('ig-blink-fast-highlighted')
        this.counter = 2
      }, 5000)

      this.counter--
      if (this.counter === 0) {
        clearTimeout(this.timeout)
        this.$el.classList.remove('ig-blink-fast-highlighted')
        this.counter = 2
        this.$emit('click', e)
      } else {
        this.$el.classList.add('ig-blink-fast-highlighted')
      }
    },
    handleMouseUp(e) {
      this.$emit('mouseup', e)
    },
    handleMouseDown(e) {
      this.$emit('mousedown', e)
    }
  },
  mounted() {
    this.counter = 2
  }
}
</script>

<style scoped>
</style>
