<template>
     <div class="grid grid-cols-12 gap-8 mb-5">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-primary font-medium mb-4">금일 주문건</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl ">{{info.orderCount}}건</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-warning font-medium mb-4">금일 매출건</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl"> {{info.deliveryCount}}건</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-info font-medium mb-4">금일 발주건</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ info.matOrderCount }}건</div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-cyan-500 !text-xl"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-secondary font-medium mb-4">금일 생산건</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl" >{{ info.workCount }}건</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-comment text-purple-500 !text-xl"></i>
                </div>
            </div>
        </div>
    </div>
</div>
    <Fluid class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">주간 제품 입고량</div>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">주간 자재 소모량</div>
                <Chart type="bar" :data="barData" :options="barOptions" />
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">주간 제품 출고량</div>
                <Chart type="doughnut" :data="pieData" :options="pieOptions" />
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">주간 자재 입고량</div>
                <Chart type="polarArea" :data="polarData" :options="polarOptions" />
            </div>
        </div>
    </Fluid>
</template>

<script>
import { useLayout } from '@/layout/composables/layout';
import axios from 'axios'
export default {
    data() {
        return {
            lineData: null,
            pieData: null,
            polarData: null,
            barData: null,
            radarData: null,
            lineOptions: null,
            pieOptions: null,
            polarOptions: null,
            barOptions: null,
            radarOptions: null,
            info : {
                orderCount : '',
                workCount : '',
                matOrderCount : '',
                deliveryCount: ''
            }
        };
    },
    created() {
        this.setColorOptions();
    },
    mounted() {
        this.countList();
        const { getPrimary, getSurface, isDarkTheme } = useLayout();

        this.stopWatcher = this.$watch(
            () => [getPrimary.value, getSurface.value, isDarkTheme.value],
            () => {
                this.setColorOptions();
            },
            { immediate: true }
        );
    },
    beforeUnmount() {
        if (this.stopWatcher) {
            this.stopWatcher(); // cleanup
        }
    },
    methods: {
        async countList(){
            await axios.get('/api/main/count',{ withCredentials: true })
                        .then(res => {
                            console.log(res.data[0][0].orderCount)
                            this.info.orderCount = res.data[0][0].orderCount;
                            this.info.matOrderCount = res.data[1][0].matOrderCount;
                            this.info.deliveryCount = res.data[2][0].deliveryCount;
                            this.info.workCount = res.data[3][0].workCount;
                        })
        },
        //차트
        async setColorOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            const line = await axios.get('/api/main/lineChart',{ withCredentials: true });
            const bar = await axios.get('/api/main/barChart',{ withCredentials: true });
            const pie = await axios.get('/api/main/pieChart',{ withCredentials: true });
            const pop = await axios.get('/api/main/popChart',{ withCredentials: true });
            const groupLine = {};
            const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

            //색깔
            const colors = [
                '#42A5F5', 
                '#66BB6A', 
                '#FFA726', 
                '#AB47BC', 
                '#FF7043', 
                '#26C6DA', 
                '#D4E157', 
                '#FFCA28', 
                '#5C6BC0', 
                '#EC407A'  
            ];
            //데이터를 제품별로 그룹화
            line.data.forEach(item => {         
                //w제품명으로 값 채 우기  -> {'prod_name' : [0,0,0,0,0,0,0,]}   
                groupLine[item.prodName] = Array(7).fill(0);
                const dayIndex = labels.indexOf(item.day);
                console.log(dayIndex)
                if (dayIndex !== -1) {
                    console.log(item.quantity)
                    //값 채우기 Index값이 2이면  {'prod_name' : [0,inedex값,0,0,0,0]}
                    groupLine[item.prodName][dayIndex] = item.quantity;
                }
            });

            //라인차트 데이터셋 만들기
            let dateSet = Object.keys(groupLine).map((name, idx) => {
                return {
                    label: name,
                    data: groupLine[name],
                    fill: false,
                    borderColor: colors[idx % 10],
                    tension: 0.4
                };
            });

            // 차트에 넣을 최종 데이터
            this.lineData = {
                labels: labels,
                datasets: dateSet
            };
            this.lineOptions = {
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColorSecondary },
                        grid: { color: surfaceBorder, drawBorder: false }
                    },
                    y: {
                        ticks: { color: textColorSecondary },
                        grid: { color: surfaceBorder, drawBorder: false }
                    }
                }
            };
            
            //자재 소모량 기입
            let groupBar = {};

            bar.data.forEach(item => {
                if (!groupBar[item.matName]) {
                    groupBar[item.matName] = Array(7).fill(0);
                }

                const dayIndex = labels.indexOf(item.day);
                groupBar[item.matName][dayIndex] += item.quantity; // 누적합으로도 가능
            });

            dateSet = Object.keys(groupBar).map((name, idx) => {
                return {
                    label: name,
                    data: groupBar[name],
                    fill: false,
                    backgroundColor: colors[idx % 10],
                    borderColor: colors[idx % 10],
                    tension: 0.4
                };
            });

            this.barData = {
                labels: labels,
                datasets: dateSet
            };


            //주간 출고량 기입
            let pieLabel = pie.data.map(item => item.prodName);
            let pieQuantity = pie.data.map(item => item.quantity);

            this.pieData = {
                labels: pieLabel,
                datasets: [
                    {
                        data: pieQuantity,
                        backgroundColor: colors,
                        hoverBackgroundColor: colors
                    }
                ]
            };

            this.pieOptions = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };

            let popLabel = pop.data.map(item => item.matName);
            let popQuantity = pop.data.map(item => item.quantity);
            

            this.polarData = {
                datasets: [
                    {
                        data: popQuantity,
                        backgroundColor: colors
                        
                    }
                ],
                labels: popLabel
            };
            this.polarOptions = {
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            }
        }
    }
};
</script>
