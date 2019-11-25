<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { guid, Mask } from '../util/inputhelper.js'
  let dispatch = createEventDispatcher()

  export let className = null
  export let value = null
  let rawvalue = null
  export let placeholder = null
  export let mask = {
    override: false,
    mask: null
  }
  $: _mask = new Mask(mask)

  let focus = false

  const onchange = (value) => dispatch('change', value)
  const onfocus = (value) => dispatch('focus', value)
  const onblur = (value) => dispatch('blur', value)
  const onkeyup = (value) => dispatch('keyup', value)

  function onFocus(){
    focus = true
    returnEvent(onfocus)
  }

  function onBlur(){
    if(!rawvalue || rawvalue.trim() == '')
      focus = false
    returnEvent(onblur)
  }

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
  <input id="svelte-inputs-input-placeholder-{id}"
    class={className ? className : ''}
    bind:value={rawvalue}
    on:change={() => returnEvent(onchange)}
    on:blur={onBlur}
    on:focus={onFocus} type="text"
    on:keyup={onKeyup} />
</div>
