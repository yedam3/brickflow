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
}
.app-dark .ag-theme-alpine .ag-header{
  background-color: #212121 !important;
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



</style>
