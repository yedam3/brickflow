<template>
    <div style="margin-top: 10px;">
        <CProgress :color="barColor" variant="striped" animated :value="progress">
            <CProgressBar>{{ progress }}%</CProgressBar>
        </CProgress>
    </div>
</template>
  
  <script>
  import { CProgress, CProgressBar } from '@coreui/vue'
  
  export default {
    name: 'ProgressCell',
    components: {
      CProgress,
      CProgressBar
    },
    props: {
      params: Object 
    },
    computed: {
      progress() {
        
        return (this.params && this.params.value != null) ? this.params.value : 0;
      },
      barColor() {
        const val = this.progress;
        if (val < 30) return 'danger';
        if (val < 60) return 'warning';
        if (val < 100) return 'info';
        return 'success';
      }
    }
  }
  </script>
<style scoped>
 /* 헤더 텍스트 가운데 정렬 */
::v-deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center;
}

/* headerClass로 설정한 header-center 클래스에 적용 */
::v-deep(.header-center .ag-header-cell-label) {
  justify-content: center;
}
</style>