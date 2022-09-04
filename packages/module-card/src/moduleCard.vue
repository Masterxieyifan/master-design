<!--
 * @Author: lingyong.zeng
 * @Date: 2021-10-28 09:37:30
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-12-10 14:24:32
 * @Description:
 * @FilePath: /vantop-ui/packages/module-card/src/moduleCard.vue
-->
<template>
  <div class="__module-card">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span class="global-module-title">
                <slot name="title">{{ title }}</slot>
            </span>
            <div class="__operations">
                <slot name="operations"></slot>
            </div>
        </div>
        <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
    name: 'MdModuleCard',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
};
</script>