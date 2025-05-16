<template>
  <router-view/>
</template>

<style>
/* Light Mode Styling */
:root .layout-topbar,
:root .layout-sidebar {
  background-color: #FFCC80 !important;
}

:root .p-card {
  background-color: #FFF8E1 !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* AG Grid Light Mode */
.ag-theme-alpine {
  border: none !important;
  box-shadow: none !important;
}

.ag-theme-alpine .ag-header {
  background-color: #FFCC80 !important;
  overflow: hidden;
}

.ag-theme-alpine .ag-row:hover {
  background-color: #FFF3E0 !important;
}

/* Dark Mode Styling */
:root[class='app-dark'] .layout-topbar,
:root[class='app-dark'] .layout-sidebar {
  background-color: #2C3E50 !important;
}

:root[class='app-dark'] .p-card {
  background-color: #263238 !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #E0E0E0;
}

:root[class='app-dark'] .p-card .p-card-title {
  color: #FAFAFA;
}

:root[class='app-dark'] .p-card .p-card-subtitle {
  color: #BDBDBD;
}

/* AG Grid Dark Mode */
:root[class='app-dark'] .ag-theme-alpine .ag-header {
  background-color: #2C3E50 !important;
  color: #E0E0E0;
  overflow: hidden;
}

:root[class='app-dark'] .ag-theme-alpine .ag-header .ag-header-cell-text,
:root[class='app-dark'] .ag-theme-alpine .ag-header .ag-header-cell {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-center-cols-viewport {
  background-color: #303030 !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-row-even {
  background-color: #303030 !important;
  color: white !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-row-odd {
  background-color: #252525 !important;
  color: white !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-cell-value {
  color: white !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-row:hover {
  background-color: #404040 !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-paging-panel {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
}

:root[class='app-dark'] .ag-theme-alpine .ag-paging-panel .ag-icon {
  color: #E0E0E0;
}

/* Form Elements Dark Mode */
:root[class='app-dark'] .p-inputgroup .p-inputgroupaddon,
:root[class='app-dark'] .p-inputgroup .p-inputtext::placeholder,
:root[class='app-dark'] .p-inputgroup,
:root[class='app-dark'] .layout-topbar .emp_name {
  color: white;
}

:root[class='app-dark'] .form-select {
  color: #E0E0E0;
  background-color: #2C3E50 !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='36' viewBox='0 0 24 24' width='36' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 40px;
}
.heading-with-line {
  display: flex;
  align-items: center;
}

.heading-with-line h3 {
  margin-bottom: 0;
  margin-right: 1rem;
}

.heading-with-line::after {
  content: "";
  flex-grow: 1;
  height: 1px;
  background-color: #dee2e6; /* Bootstrap의 border 색상 */
}
</style>
