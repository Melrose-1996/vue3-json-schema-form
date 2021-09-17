<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" :age="12" />
  <span>{{ name }}:{{ computedNameRef }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watchEffect } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

interface Config {
  name: string
}

export default defineComponent({
  name: 'App',
  // props: {
  //   age: {
  //     // 注意这个 Number 不是 js 的写法，而是一个类，而这个类是需要用 ts 去定义的
  //     type: Number as PropType<number>,
  //   },
  //   // config: {
  //   //   type: Object as PropType<Config>,
  //   //   required: true,
  //   // },
  // },
  components: {
    HelloWorld,
  },
  setup(props, { slots, attrs, emit }) {
    let name = ref('jokcy')

    setInterval(() => {
      name.value += '1'
    }, 1000)

    const computedNameRef = computed(() => {
      return name.value + '2'
    })

    watchEffect(() => {
      // 会在这个函数引入的所有响应式的值变化之后重新执行（注意，只有是在这个函数引入的变量发生变化的时候才会触发）
      console.log(name.value)
    })

    return {
      name,
      computedNameRef,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
