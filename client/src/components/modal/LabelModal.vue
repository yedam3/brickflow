<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="lg" style="min-width: 600px;">
      <CModalHeader>
        <slot name="header"><strong>전표출력</strong></slot>
      </CModalHeader>
  
      <CModalBody>
        <div class="text-center">
        <h2>QR코드</h2>
      </div>
        <div ref="qrContainer" class="d-flex justify-content-center mb-3 flex-wrap">
          <div v-for="(item, index) in datable" :key="index" class="mb-4 text-center me-5 card">
            <qrcode-vue :value="getQRCodeValue(item)" :size="200" />
            <Button label="QR 다운로드" severity="info" @click="downloadQRCode(index)" class="mt-3"/>
          </div>
        </div>
  
        <div v-if="datable.length > 0" class="preview-container">
          <div v-for="(info, index) in datable" :key="index" class="preview-card shadow card p-4 mb-3">
            <p class="mb-1"><strong>생산 LOT</strong>: {{ info.work_lot }}</p>
            <p class="mb-1"><strong>제품 코드</strong>: {{ info.prod_code }}</p>
            <p class="mb-1"><strong>제품명</strong>: {{ info.prod_name }}</p>
            <p class="mb-0"><strong>입고 수량</strong>: {{ info.finish_quantity }}</p>
          </div>
        </div>
        <div v-else class="text-center text-muted">표시할 항목이 없습니다.</div>
      </CModalBody>
  
      <CModalFooter>
        <slot name="footer">
          <Button label="모든 QR 다운로드" severity="success" @click="downloadAllQRCodes" />
          <Button label="닫기" severity="danger" @click="close"/>
        </slot>
      </CModalFooter>
    </CModal>
  </template>
  
  <script>
  import QrcodeVue from "qrcode.vue";
  
  export default {
    components: { QrcodeVue },
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      datable: {
        type: Array
      },
    },
    methods: {
      close() {
        this.$emit("close");
      },
  
      getQRCodeValue(item) {
        try {
          const jsonData = JSON.stringify({
            prod_code: item.prod_code,
            quantity: item.finish_quantity,
            prod_name: item.prod_name,
            work_lot :item.work_lot
          });
          const encodedData = encodeURIComponent(jsonData);
          return `http://localhost:8099/seller/finishstore?data=${encodedData}`;
        } catch (error) {
          console.error("QR 코드 생성 오류:", error);
          return "";
        }
      },
  
      downloadQRCode(index) {
        //qr 컨테이너 접근
        const qrCode = this.$refs.qrContainer.children[index];
        if (!qrCode) {
          console.error("QR 코드를 찾을 수 없습니다.");
          return;
        }
        //큐알 canvas 찾기
        const originalCanvas = qrCode.querySelector("canvas");
        if (!originalCanvas) {
          console.error("canvas를 찾을 수 없습니다.");
          return;
        }

        // 캔버스를 임시로 크게 복사해서 저장용으로 사용
        const scale = 3; // 3배 확대
        const newCanvas = document.createElement("canvas");
        //새로운 캔버스에 넓이 및 크기 조정
        newCanvas.width = originalCanvas.width * scale;
        newCanvas.height = originalCanvas.height * scale;

        //캔바스 2d 컨텍스를 얻는다
        const ctx = newCanvas.getContext("2d");
        //2d 컨텍스트 크기 늘리기
        ctx.scale(scale, scale); 
        //원본 캔버스를 확대된 좌표에 맞게 그려 넣기 
        ctx.drawImage(originalCanvas, 0, 0);

        //이미지경로 설정
        const dataUrl = newCanvas.toDataURL("image/png");
        //a태그 생성
        const a = document.createElement("a");
        //a태그의 이미지 경로설정
        a.href = dataUrl;
        //이름 설정
        a.download = `qrcode-${index + 1}.png`;
        //a태그 추가
        document.body.appendChild(a);
        //a태그 강제 발생
        a.click();
        //a태그 삭제
        document.body.removeChild(a);
      },
  
      downloadAllQRCodes() {
        this.datable.forEach((item, index) => {
          this.downloadQRCode(index);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .preview-container {
    max-height: 300px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .preview-card {
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: #fdfdfd;
   
    padding: 20px;
    width: 200px;
    box-sizing: border-box;
  }
  
  .qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 250px;
  }
  

  </style>
  