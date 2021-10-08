module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
}
