import { createApp } from 'vue'

import App from './App'

// 也可以通过 createVNode 来替换掉 h 函数（对于 createVNode 来说， children 一定是数组， h 函数只是对 createVNode 进行了一些简单的封装，包括对参数的判断）

// import App from './App.vue'

// // 如果在 .vue 的 template 里面，会根据相对地址，通过 vue.loader/url.loader 回去加载那个图片的地址形成真正的地址
// // 样式也会不一样，因为 .vue 会通过 css.loader 来进行编译
// // h 函数就是用来创建节点的，类似于 creatElement

createApp(App).mount('#app')
