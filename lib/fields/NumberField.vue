<template>
  <input :value="value" @input="handleChange" type="number" />
</template>

<script lang="ts" setup="props">
import { defineProps } from 'vue'
import { Schema } from '../types'

const props = defineProps<{
  value: any
  onChange: (v: any) => void
  schema: Schema
}>()

const handleChange = (e: any) => {
  const value = e.target.value
  const num = Number(value)
  console.log(e)
  // 如果 num 是 NAN，说明输入的不是数字
  if (Number.isNaN(num)) {
    props.onChange(undefined)
  } else {
    props.onChange(num)
  }
}
</script>
