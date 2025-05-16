<template>
  <router-view/>
</template>

<style>
/* 다크 모드 X */
:root .layout-topbar {
  background-color: #FFCC80 !important;
}

:root .layout-sidebar {
  background-color: #FFCC80 !important;
}

/* 다크 모드 스타일 */
:root[class='app-dark'] .layout-topbar {
  background-color: #2C3E50 !important;
}

:root[class='app-dark'] .layout-sidebar {
  background-color: #2C3E50 !important;
}

/* Table Header Styling - Light Mode */
.ag-theme-alpine .ag-header {
  background-color: #FFCC80 !important;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}

/* AG 그리드 테두리 삭제 */
.ag-theme-alpine {
  border: none !important;
  box-shadow: none !important;
}

/* 테이블 헤더 - 다크 모드 */
.app-dark .ag-theme-alpine .ag-header {
  background-color: #FFCC80 !important;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}

/* ag-gripd 헤더 - 다크 모드 */
.app-dark .ag-theme-alpine .ag-header .ag-header-cell {
  color: #212121 !important;
}

/* 테이블 바디 - 다크 모드 */
.app-dark .ag-theme-alpine .ag-center-cols-viewport {
  background-color: #303030 !important;
}

/* 테이블 - 다크 모드 */
.app-dark .ag-theme-alpine .ag-row-even {
  background-color: #303030 !important;
  color: white !important;
}

/* ODD 행 - 다크 모드 */
.app-dark .ag-theme-alpine .ag-row-odd {
  background-color: #252525 !important;
  color: white !important;
}

/* 셀 값 - 다크 모드 */
.app-dark .ag-theme-alpine .ag-cell-value {
  color: white !important;
}

/* 마우스 OVER 시 다크모드 */
.app-dark .ag-theme-alpine .ag-row:hover {
  background-color: #404040 !important;
}

.ag-theme-alpine .ag-row:hover {
  background-color: #FFF3E0 !important;
}

/* 카드 */
/* 다크모드 X */
:root .p-card {
  background-color: #FFF8E1 !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 카드 - 다크 모드*/
:root[class='app-dark'] .p-card {
  background-color: #263238 !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #E0E0E0;
}

/* 카드 제목 - 다크 모드 */
:root[class='app-dark'] .p-card .p-card-title {
  color: #FAFAFA;
}

/* 카드 자막 - 다크 모드 */
:root[class='app-dark'] .p-card .p-card-subtitle {
  color: #BDBDBD;
}

.ag-theme-alpine .ag-header {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* AG-grid 헤더, 페이징바 - 다크모드 */
:root[class='app-dark'] .ag-theme-alpine .ag-header {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
}

/* AG-grid 셀 제목 - 다크모드 */
:root[class='app-dark'] .ag-theme-alpine .ag-header .ag-header-cell-text {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
}

/* AG-grid 페이징 바 - 다크모드 */
:root[class='app-dark'] .ag-theme-alpine .ag-paging-panel {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-paging-panel .ag-icon {
  color: #E0E0E0;
}

:root[class='app-dark'] .p-inputgroup .p-inputgroupaddon {
  color: white;
}

:root[class='app-dark'] .p-inputgroup .p-inputtext::placeholder {
  color: white;
}

:root[class='app-dark'] .p-inputgroup {
  color: white;
}

:root[class='app-dark'] .form-select {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
  appearance: none; /* 기본 화살표 제거 */
  -webkit-appearance: none;
  -moz-appearance: none;
  /* 화살표 크기 키우기 - SVG의 height와 width 값을 증가 */
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='36' viewBox='0 0 24 24' width='36' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 40px; /* 더 큰 화살표를 위한 공간 확보 */
}

/* AG-grid 셀 구분선 */
</style>
