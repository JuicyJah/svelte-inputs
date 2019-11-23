<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { guid } from '../util/inputguid.js'
  let dispatch = createEventDispatcher()

  export let className = null
  export let value = null
  export let placeholder = null

  let focus = false

  const onchange = (value) => dispatch('change', value)
  const onfocus = (value) => dispatch('focus', value)
  const onblur = (value) => dispatch('blur', value)

  function onFocus(){
    focus = true
  }

  function onBlur(){
    if(!value || value.trim() == '')
      focus = false
  }

  let id = null
  onMount(() => {
    if(value && value.trim() != '')
      focus = true
    id = guid()
  })
</script>
<style>
.svelte-inputs-input-placeholder, .svelte-inputs-input-placeholder *{
  box-sizing: border-box;
}
.svelte-inputs-input-placeholder{
  position: relative;
  display: block;
  cursor: text;
}
.svelte-inputs-input-placeholder > label{
  position: absolute;
  font-size: 1em;
  top: 25%;
  left: 0;
}
.svelte-inputs-input-placeholder.focus > label{
  top: 0;
  font-size: 0.75em;
  bottom: auto;
}
.svelte-inputs-input-placeholder > input{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  padding-top: 0.75em;
  font-size: 1em;
}
</style>
<div class="svelte-inputs-input-placeholder" class:focus={focus === true}>
  <label for="svelte-inputs-input-placeholder-{id}">{placeholder ? placeholder : ''}</label>
  <input id="svelte-inputs-input-placeholder-{id}" class={className ? className : ''} bind:value={value} on:change={() => onchange(value)} on:blur={onBlur} on:focus={onFocus} type="text" />
</div>
