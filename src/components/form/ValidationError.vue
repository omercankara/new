<template>
    <div class="validation-error"
         v-if="props.errors"
    >
        <div class="validation-error-item"
             v-for="(error, errorKey) in props.errors"
             :key="errorKey"
        >
            {{ error.$message }}
        </div>
    </div>
</template>
<script setup
        lang="ts"
>
    interface propsInterface {
        errors?: any[] | null
    }
    
    const props = defineProps<propsInterface>()
</script>

<style lang="scss"
       scoped
>
    .validation-error {
        font-size: 12px;
        margin-top: 5px;
        margin-bottom: 5px;
        
        .validation-error-item {
            color: #f43c3c;
        }
    }
</style>