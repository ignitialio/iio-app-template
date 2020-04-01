module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  /* FIX: Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>' */
  sourceType: 'unambiguous'
}
