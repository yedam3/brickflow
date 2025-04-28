<template>
  <div class="ag-theme-alpine" style="width: 1000px; height: 250px; background-color: white;">
    <div class="d-flex flex-wrap gap-4">
      <div class="p-4">
        <h6>설비코드 <input value="" class="form-control" style="border: 1px solid black;"></h6>
        <h6>설비이름 <input value="" class="form-control" style="border: 1px solid black;"></h6>
        <h6>설비위치 <input value="" class="form-control" style="border: 1px solid black;"></h6>
      </div>
      <div class="p-4">
        <h6>담당자 <input value="" class="form-control" style="border: 1px solid black;"></h6>
        <h6>설비유형<select value="" class="form-select form-control"
            style="height: 34px; border: 1px solid black; font-size: 12px; color: gray;">
            <option value="">선택하시오</option>
            <option value="">1</option>
            <option value="">2</option>
            <option value="">3</option>
          </select></h6>
        <h6>설치일자 <input value="" class="form-control" style="border: 1px solid black;"></h6>
      </div>
      <div class="p-4">
        <h6>점검주기 <input value="" class="form-control" style="border: 1px solid black;"></h6>
        <h6>이미지 <input value="" class="form-control" style="border: 1px solid black;"></h6>
        <h6>설비상태 <input value="" class="form-control" style="border: 1px solid black;"></h6>
      </div>
    </div>
    <div class="d-flex justify-content-end p-4">
      <Button label="등록" severity="info" class="me-3" />
      <Button label="수정" severity="help" class="me-3" />
      <Button label="삭제" severity="danger" class="me-5" />
    </div>
  </div>
</template>
