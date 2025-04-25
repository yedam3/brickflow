<template>
  <input
    type="date"
    :value="value"
    @input="onInput"
    @blur="onBlur"
    class="ag-input"
  />
</template>

<script>
export default {
  props: ['value'], 
  data() {
    return {
      internalValue: this.value
    };
  },
  methods: {
    onInput(event) {
      this.internalValue = event.target.value;
    },
    onBlur() {
      this.params.stopEditing();
    },
    getValue() {
      return this.internalValue;
    }
  },
  mounted() {
    // ag-Grid는 props 말고 this.params로 다양한 정보를 전달함
    this.internalValue = this.params.value;
  }
};
</script>
