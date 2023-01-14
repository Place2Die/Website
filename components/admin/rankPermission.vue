<template>
    <a class="panel-block">
        <span class="icon-text" :class="color">
            <span class="icon">
                <i class="fas" :class="icon" aria-hidden="true" />
            </span>
            <span class="tooltip">
                {{ permission }}
                <span class="tooltip-text">{{ permissionFull }}</span>
            </span>
        </span>
        <span class="permission-checkbox">
            <input type="checkbox" :checked="isEnabled" @change="updatePermission">
        </span>
    </a>
</template>

<script setup>

const props = defineProps({
    permission: {
        type: String,
        required: true,
        default: 'default'
    },
    isEnabled: {
        type: Boolean,
        required: true,
        default: false
    }
})

const emit = defineEmits(['update'])
const isEnabled = ref(props.isEnabled)
const permission = ref(props.permission)
const permissionFull = ref(props.permission)
const color = ref('')
const icon = ref('')

const update = () => {
    emit('update', {
        permission: permission.value,
        isEnabled: isEnabled.value
    })
}

const updatePermission = () => {
    isEnabled.value = !isEnabled.value
    update()
}

onMounted(() => {
    switch (permission.value.split('.')[0]) {
    case 'admin':
        color.value = 'has-text-danger'
        icon.value = 'fa-user-shield'
        break
    case 'moderator':
        color.value = 'has-text-warning'
        icon.value = 'fa-user-cog'
        break
    case 'user':
        color.value = 'has-text-success'
        icon.value = 'fa-user'
        break
    default:
        color.value = ''
        icon.value = 'fa-question'
        break
    }

    // Split permission by comma then re join everything except the first by an arrow symbol
    permission.value = permission.value.split('.').slice(1).join(' → ')
})

</script>

<style lang="scss" scoped>

    .permission-checkbox {
        margin-left: auto;
    }

</style>
