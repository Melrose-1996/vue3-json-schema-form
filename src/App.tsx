import { defineComponent, reactive, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

function renderHelloWorld(num: number) {
  return <HelloWorld age={num} />
}

export default defineComponent({
  // 主张通过 setup 返回一个函数，因为 setup 声明的 ref reactive computed ... 都是可以在 return 的组件函数里面去使用的
  setup() {
    const state = reactive({
      name: 'Melrose',
    })

    const numberRef = ref(1)

    return () => {
      const number = numberRef.value

      console.log(state.name)

      // 在 jsx 所有的变量和表达式都通过 {} 来表示就可以了
      // 注意在 jsx 里面当必传属性没有传的时候，或者传的类型不对，ts 都会提示报错
      return (
        <div id="app">
          <img src={require('./assets/logo.png')} alt="Vue logo" />
          {/* <HelloWorld age={12} /> */}
          <input type="text" v-model={state.name} />
          {renderHelloWorld(12)}
          <p>{state.name + number}</p>
        </div>
      )
    }

    // return () => {
    //     const number = numberRef.value
    //     return h('div', { id: 'app' }, [
    //         h('img', { alt: 'Vue logo', src: require('./assets/logo.png') },),
    //         h(HelloWorld, { msg: 'Welcome to Your Vue.js + TypeScript App', age: 12 },),
    //         h('p', state.name + number),
    //     ])
    // }
  },
})
