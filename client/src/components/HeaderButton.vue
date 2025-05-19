<template>
    <div class="custom-header">
        <span>{{ params.displayName }}</span>
        <button class="btn btn-sm btn-success text-white" @click="onClick">추가</button>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    props: ['params'],
    methods: {
        onClick() {
            if(this.params.column.colId === 'editRow') {
                const parent = this.params.context?.componentParent;
                console.log(parent?.formData?.plan_code)
                if (parent?.formData?.plan_code && parent.formData.plan_code !== '') {
                    Swal.fire({
                        title: '실패',
                        text: '생산 계획으로 가져온 데이터는 추가가 불가능합니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return;
                }
                const newRow = {
                    prod_code: '',
                    prod_name: '',
                    plan_quantity: '',
                    priority: '',
                    order_quantity: '',
                };
                this.params.context.componentParent.addNewRow(newRow);
                console.log('행 추가됨:', newRow);
            }
        },
    },
};
</script>

<style scoped>
.custom-header {
    display: flex;
    align-items: center;
}
</style>