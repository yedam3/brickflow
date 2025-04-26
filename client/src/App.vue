<template>
  <router-view/>
</template>

<style>
:root .layout-topbar{
    background-color: antiquewhite !important;
  }
:root .layout-sidebar{
    background-color: antiquewhite !important;
  }
  :root[class='app-dark'] .layout-topbar {
    background-color: black !important;
}
:root[class='app-dark'] .layout-sidebar {
    background-color: black !important;
}
.ag-theme-alpine .ag-header {
  background-color: #FFCC80 !important;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
/* 전체 그리드 테두리 제거 */
.ag-theme-alpine {
  border: none !important;
  box-shadow: none !important; /* 그림자도 제거하고 싶으면 */
}

.app-dark .ag-theme-alpine .ag-header{
  background-color: #212121 !important;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
.app-dark .ag-theme-alpine .ag-header .ag-header-cell{
  color : white !important;
}
.app-dark .ag-theme-alpine .ag-center-cols-viewport{
  background-color: black !important;
}
.app-dark .ag-theme-alpine .ag-row-even{
  background-color: black !important;
  color : white !important;
}
.app-dark .font-semibold{
  color : white !important;
}
.app-dark .ag-cell-value{
  color : black !important;
}

</style>
