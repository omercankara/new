<template>
    <div class="page-header">
        <div class="page-header-start-actions" v-if="$slots['start-action']">
            <slot name="start-action"></slot>
        </div>
        <div class="page-header-title">
            {{ props.title }}
        </div>
        <div class="page-header-end-actions">
            <slot name="end-action"></slot>
        </div>
    </div>
</template>
<script setup
        lang="ts"
>
    interface propsInterface {
        title: string
        paddingLeft?: string
        paddingRight?: string
    }
    
    const props = withDefaults(defineProps<propsInterface>(), {
        paddingLeft: '15px',
        paddingRight: '15px'
    })
</script>

<style lang="scss"
       scoped
>
    .page-header {
        display: flex;
        align-items: center;
        background: #f3f2f7;
        height: 42px;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: v-bind(paddingLeft);
        padding-right: v-bind(paddingLeft);
        &:has(.page-header-start-actions) {
            padding-left: 5px;
        }
        .page-header-title {
            font-size: 18px;
            font-family: var(--font-medium), sans-serif;
            flex-grow: 1;
        }
        .page-header-end-actions {
            display: flex;
            gap: 1rem;
            flex-basis: 0;
        }
    }
</style>