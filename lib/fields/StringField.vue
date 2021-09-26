<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup="props">
// import { ref } from 'vue'
import { defineProps } from 'vue'
import { Schema } from '../types'
// export default {
//   props: FiledPropsDefine,
// }
const props = defineProps<{
  value: any
  onChange: (v: string) => void
  schema: Schema
}>()

// declare const props: {
//   value: any
//   onChange: (v: string) => void
//   schema: Schema
// }
const handleChange = (e: any) => {
  console.log(e)
  props.onChange(e.target.value)
}
</script>
