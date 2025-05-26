<script setup lang="ts">
import { Table } from 'ant-design-vue'
import { throttle } from 'es-toolkit'
import yaml from 'js-yaml'
import { defineProps, ref, watch } from 'vue'

const props = defineProps<{
  code?: string
}>()

const tableData = ref({
  columns: [],
  dataSource: [],
})

const handleYamlParse = throttle((code: string) => {
  if (!code) return
  try {
    const json = yaml.load(code) as typeof tableData.value
    if (Array.isArray(json.columns)) {
      tableData.value.columns = json.columns.filter((it: any) => {
        if (!it || !it.title || !it.key) return false

        return true
      })
    }

    if (Array.isArray(json.dataSource)) {
      tableData.value.dataSource = json.dataSource.filter(it => !!it)
    }
  }
  catch (error) {
    // console.log('>>', error)
  }
}, 50)

watch(() => props.code, (code, oldCode) => {
  handleYamlParse(code || '')
}, {
  immediate: true,
})
</script>

<template>
  <div>
    <Table
      :columns="tableData.columns"
      :dataSource="tableData.dataSource"
    />
  </div>
</template>

<style module="Css" lang="less">

</style>
