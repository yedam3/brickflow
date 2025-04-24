<template>
  <div class="grid grid-cols-12 gap-8">
    <a>영업관리</a>
    <div class="input-group input-group-sm mb-3">
      <span class="input-group-text" id="inputGroup-sizing-sm">Small</span>
      <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  created() {
    this.test();
  },

  methods: {
    async test() {
      let result = await axios.get('/api/test')
                              .chatch(err => console.log(err));

      console.log(result.data)
    }
  }
}
</script>