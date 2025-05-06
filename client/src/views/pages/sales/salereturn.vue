<template>
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">판매 이력</div>
  
  <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="orderList" />
      <Button label="등록" severity="info" class="me-3" @click="" />
      <Button label="수정" severity="help" class="me-3" @click="" />
      <Button label="삭제" severity="danger" class="me-5" @click="" />
    </div>
  
  <div class="mb-3">
      <Card style="overflow: hidden; background-color: #f8f9fa;">
        <template #content>
          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  업체명
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품명
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  주문번호
                </InputGroupAddon>
                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>
          </template>
        </Card>
      </div>
      <!--메인 그리드-->
    <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
    height: 150px;" :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"
      :defaultColDef="defaultColDef" @cellClicked="comCellClicked">
    </ag-grid-vue>
    </div>

    <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">반품 관리</div>
    <div class="mb-3">
      <Card style="overflow: hidden; background-color: #f8f9fa;">
        <template #content>
          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품명
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  업체명
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  LOT번호
                </InputGroupAddon>
                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>
          <div class="mb-5 row">
          <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  수량
                </InputGroupAddon>
                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  판매일자
                </InputGroupAddon>
                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>
          </template>
        </Card>
      </div>
    </div>
    
  </template>

  <script>
  import { AgGridVue } from 'ag-grid-vue3';

export default{
  components:{
    AgGridVue,

  },
  data(){
    return {
      formData: {
        end_date: "",       // 종료_일자
        finish_status: "",  // 처리_상태
        note: "",           // 비고
      },
    }
  }
}

</script>
  