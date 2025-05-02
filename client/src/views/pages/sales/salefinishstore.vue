<template>
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">완제품 관리</div>
    <div class="font-semibold text-l mb-4">완제품 입고</div>
    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="" />
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
                  입고일자
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  창고
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  주문명
                </InputGroupAddon>
                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>

          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  입고일자
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  창고
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>

          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  입고일자
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  창고
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>
          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  입고일자
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        plan_code: "",      // 생산계획_코드
        orders_code: "",    // 주문_코드
        plan_name: "",      // 생산계획명
        employee_code: "",  // 담당자
        start_date: "",     // 시작_일자
        end_date: "",       // 종료_일자
        finish_status: "",  // 처리_상태
        note: "",           // 비고
      },
    }
  }
}
</script>
<style>
.input-group-text {
  background-color: #FFCC80;
  border-color: #FFCC80;
}
</style>