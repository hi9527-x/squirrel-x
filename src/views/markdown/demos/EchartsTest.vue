<script setup lang="ts">
import * as echarts from 'echarts'
import { isJSONObject } from 'es-toolkit'
import { onMounted, ref } from 'vue'

const props = defineProps<{ code: string }>()

const refEle = ref<HTMLElement>()

onMounted(() => {
  try {
    if (!refEle.value) return
    const option = JSON.parse(props.code || '')
    if (!isJSONObject(option)) return
    const myChart = echarts.init(refEle.value)
    myChart.setOption(option)
  }
  catch (error) {

  }
})
</script>

<template>
  <div
    ref="refEle"
    class="h-100"
  />
</template>
