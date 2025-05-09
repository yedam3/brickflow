<template>
    <FloatingConfigurator />
    <div class="background-img dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #FF9900 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="../../../../public/images/logo.png" 
                             alt="Logo" 
                             class="mx-auto mb-4" 
                             style="width: 100px; height: auto;"/>
                             
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to BrickFlow!</div>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">id</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="id" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                        </div>
                        <Button label="Sign In" class="w-full" style="background-color: #FF9900; border: #FF9900;" @click="loginBtn"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

export default {
  components: {
    FloatingConfigurator,
  },
  data() {
    return {
      id: '',
      password: '',
      checked: false,
    };
  },
  methods: {
    loginBtn () {
        axios.post('/api/login/',{
            id:this.id,
            pwd:this.password
        },
        //cors 정책 통과
        { withCredentials: true } 
    )
        .then(async res => {
            console.log(res.data)
            if(res.data.result == 'success'){
                //피니아 중간 저장소에 등록
                let result  = await axios.get('/api/session')
                                    .catch((err) => console.log(err));
                console.log(result)
                const store = useUserStore();

                store.setUser({
                    id: this.id,
                    empName : result.data.empName,
                    dep : result.data.dep
                })
                this.$router.push('/');
            }else{
                alert('실패')
            }
        })
    }
  }
};
</script>
<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.background-img {
    background-image: url('../../../assets/background.png');
}
</style>
