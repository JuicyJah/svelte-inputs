<script>
  import { createEventDispatcher } from 'svelte'
  let dispatch = createEventDispatcher()

  export let className = null
  export let value = null
  export let placeholder = null

  const change = (value) => dispatch('change', value)
</script>
<style>
.svelte-inputs-input{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: inherit;
  display: inline;
}
</style>
<input class="svelte-inputs-input {className ? className : ''}" bind:value={value} placeholder={placeholder} on:change={() => change(value)} type="text" />
