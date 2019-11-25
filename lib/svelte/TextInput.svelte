<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { guid, Mask } from '../util/inputhelper.js'
  let dispatch = createEventDispatcher()

  export let className = null
  export let value = null
  let rawvalue = null
  export let placeholder = null
  export let disabled = false
  export let mask = {
    override: false,
    mask: null
  }
  $: _mask = new Mask(mask)

  const onchange = (value) => dispatch('change', value)
  const onfocus = (value) => dispatch('focus', value)
  const onblur = (value) => dispatch('blur', value)
  const onkeyup = (value) => dispatch('keyup', value)

  function onKeyup(event){
    if(_mask)
      _mask.onKeyEvent(event)
    returnEvent(onkeyup)
  }

  function returnEvent(func){
    rawvalue = _mask ? _mask.getDisplayValue() : rawvalue
    value = _mask ? _mask.getValue() : rawvalue
    if(func)
      func(value)
  }

  let id = null
  onMount(() => {
    rawvalue = value
    if(rawvalue && rawvalue.trim() != ''){
      focus = true
    }
    if(_mask){
      _mask.setValue(rawvalue)
      rawvalue = _mask.getDisplayValue()
      returnEvent()
    }
    id = guid()
  })
</script>
<style>
.svelte-inputs-input{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: inherit;
  display: inline;
}
.svelte-inputs-input.disabled{
  cursor: not-allowed;
  background-color: #bbb;
}
</style>
<input id="svelte-inputs-input-{id}" class="svelte-inputs-input{className ? className : ''}"
  class:disabled={disabled === true}
  bind:value={rawvalue}
  placeholder={placeholder}
  on:focus={() => returnEvent(onfocus)}
  on:change={() => returnEvent(onchange)}
  on:blur={() => returnEvent(onblur)}
  on:keyup={onKeyup}
  disabled={disabled === true}
  type="text" />
