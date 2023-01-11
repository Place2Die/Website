<template>
    <div class="card">
        <div v-if="true" class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <img :src="pdpUrl" alt="Placeholder image">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">
                        {{ user.mc ? user.mc : user.email }}
                    </p>
                    <p v-if="user.mc" class="subtitle is-6">
                        {{ user.email }}
                    </p>
                    <div class="tags">
                        <span class="tag" :class="rankColor">
                            <span class="icon-text">
                                <span class="icon">
                                    <i v-if="user.rank.name === 'admin'" class="fas fa-crown" />
                                    <i v-else-if="user.rank.name === 'moderator'" class="fas fa-shield-alt" />
                                    <i v-else-if="user.rank.name === 'developer'" class="fas fa-laptop" />
                                    <i v-else class="fas fa-user" />
                                </span>
                                <span style="text-transform: capitalize">{{ user.rank.name }}</span>
                            </span>
                        </span>
                        <span v-if="user.discord" class="tag is-link">
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fa-brands fa-discord" />
                                </span>
                                <span>{{ user.discord }}</span>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="media-right">
                    <div class="dropdown is-right" :class="{'is-hoverable': showActions}" @mouseleave="showActions = false">
                        <div class="dropdown-trigger">
                            <button class="button" @click="showActions = !showActions">
                                <span class="icon is-small">
                                    <i class="fas fa-ellipsis-vertical" />
                                </span>
                            </button>
                        </div>
                        <div id="dropdown-menu" class="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a v-if="canBePromoted && !isCardRankHigher && permissions['admin.users.promote']" href="#" class="dropdown-item" @click="promote">
                                    <span class="icon-text is-small">
                                        <span class="icon">
                                            <i class="fas fa-arrow-up" />
                                        </span>
                                        <span>Promote</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-grey-lighter is-disabled">
                                        <span class="icon">
                                            <i class="fas fa-arrow-up" />
                                        </span>
                                        <span>Promote</span>
                                    </span>
                                </a>
                                <a v-if="canBeDemoted && !isCardRankHigher && permissions['admin.users.demote']" href="#" class="dropdown-item" @click="demote">
                                    <span class="icon-text is-small">
                                        <span class="icon">
                                            <i class="fas fa-arrow-down" />
                                        </span>
                                        <span>Demote</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-grey-lighter is-disabled">
                                        <span class="icon">
                                            <i class="fas fa-arrow-down" />
                                        </span>
                                        <span>Demote</span>
                                    </span>
                                </a>
                                <hr class="dropdown-divider">
                                <a v-if="permissions['admin.users.edit.username'] && !isCardRankHigher" href="#" class="dropdown-item" @click="modal('username')">
                                    <span class="icon-text is-small">
                                        <span class="icon">
                                            <i class="fas fa-tag" />
                                        </span>
                                        <span>Edit username</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-grey-lighter is-disabled">
                                        <span class="icon">
                                            <i class="fas fa-tag is-disabled" />
                                        </span>
                                        <span>Edit username</span>
                                    </span>
                                </a>
                                <a v-if="permissions['admin.users.edit.email'] && !isCardRankHigher" href="#" class="dropdown-item">
                                    <span class="icon-text is-small" @click="modal('email')">
                                        <span class="icon">
                                            <i class="fas fa-at" />
                                        </span>
                                        <span>Edit email</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-grey-lighter is-disabled">
                                        <span class="icon">
                                            <i class="fas fa-at is-disabled" />
                                        </span>
                                        <span>Edit email</span>
                                    </span>
                                </a>
                                <a v-if="permissions['admin.users.edit.discord'] && !isCardRankHigher" href="#" class="dropdown-item">
                                    <span class="icon-text is-small" @click="modal('discord')">
                                        <span class="icon">
                                            <i class="fab fa-discord" />
                                        </span>
                                        <span>Edit discord</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-grey-lighter is-disabled">
                                        <span class="icon">
                                            <i class="fab fa-discord is-disabled" />
                                        </span>
                                        <span>Edit discord</span>
                                    </span>
                                </a>
                                <a v-if="permissions['admin.users.reset-password'] && !isCardRankHigher" href="#" class="dropdown-item">
                                    <span class="icon-text is-small">
                                        <span class="icon">
                                            <i class="fas fa-key" />
                                        </span>
                                        <span>Reset password</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-grey-lighter is-disabled">
                                        <span class="icon">
                                            <i class="fas fa-key" />
                                        </span>
                                        <span>Reset password</span>
                                    </span>
                                </a>
                                <hr class="dropdown-divider">
                                <a v-if="permissions['admin.users.delete'] && !isCardRankHigher" href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-danger">
                                        <span class="icon">
                                            <i class="fas fa-trash" />
                                        </span>
                                        <span>Delete</span>
                                    </span>
                                </a>
                                <a v-else href="#" class="dropdown-item">
                                    <span class="icon-text is-small has-text-danger-light is-disabled">
                                        <span class="icon">
                                            <i class="fas fa-trash" />
                                        </span>
                                        <span>Delete</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <span class="icon-text is-small has-text-grey-lighter is-disabled">
                <span class="icon">
                    <i class="fas fa-user" />
                </span>
                <span>View profile</span>
            </span>
        </div>
    </div>
</template>

<script setup>

import { updateRankOfUser } from '~/composables/useFirebase'

const pdpUrl = ref('https://crafatar.com/renders/head/853c80ef3c3749fdaa49938b674adae5?size=4&default=MHF_Steve&overlay')

const ranks = ref([])

const userRank = useRank()

const cardUserRank = ref({})

const showActions = ref(false)

const wantedPermissions = ['admin.users.promote', 'admin.users.demote', 'admin.users.edit.username', 'admin.users.edit.email', 'admin.users.edit.discord', 'admin.users.delete', 'admin.users.reset-password']
const permissions = ref({})
const rankColor = ref('')

const updatePermissions = async () => {
    for (const permission of wantedPermissions) {
        permissions.value[permission] = await isAllowed(permission)
    }
}

const isCardRankHigher = computed(() => {
    if (!userRank.value || !cardUserRank.value) { return false }
    return userRank.value.index <= cardUserRank.value.index
})

/**
 * @typedef {Object} Rank
 * @property {string} name
 * @property {number} index
 * @property {Record<string, boolean>} permissions
 */

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} mc
 * @property {string} discord
 * @property {string} email
 * @property {Rank} rank
 */

const user = ref(/** @type {User} */ ({
    uid: '',
    mc: '',
    discord: '',
    email: '',
    rank: {
        name: '',
        index: 0,
        permissions: {}
    }
}))

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

// Watch the user rank so when it change we can change the color of the rank
watchEffect(() => {
    if (user.value.rank) {
        switch (user.value.rank.name) {
        case 'admin':
            rankColor.value = 'is-danger'
            break
        case 'moderator':
            rankColor.value = 'is-warning'
            break
        case 'developer':
            rankColor.value = 'is-info'
            break
        default:
            rankColor.value = ''
            break
        }
    }
})

onMounted(async () => {
    cardUserRank.value = props.user.rank
    user.value = props.user
    ranks.value = await getAllRanks()
    // remove all ranks under the user rank
    ranks.value = ranks.value.filter(rank => parseInt(rank.index) <= parseInt(userRank.value.index))
    if (props.user.mc) {
        try {
            pdpUrl.value = await get3DHeadFromUsername(props.user.mc)
        } catch (e) {
        }
    }
    await updatePermissions()
})

const emit = defineEmits(['open-modal', 'close-modal'])

const modal = (id) => {
    emit('open-modal')
    const title = document.getElementById('modal-title')
    const input = document.getElementById('modal-input')
    switch (id) {
    case 'username':
        title.innerText = 'Username'
        input.value = props.user.mc ? props.user.mc : ''
        break
    case 'email':
        title.innerText = 'Email'
        input.value = props.user.email ? props.user.email : ''
        break
    case 'discord':
        title.innerText = 'Discord'
        input.value = props.user.discord ? props.user.discord : ''
        break
    }
}

const canBePromoted = computed(() => {
    if (!cardUserRank.value) { return false }
    const aboveUserRank = ranks.value.filter(rank => parseInt(rank.index) > parseInt(cardUserRank.value.index))
    return aboveUserRank.length > 0
})

const canBeDemoted = computed(() => {
    if (!cardUserRank.value) { return false }
    const belowUserRank = ranks.value.filter(rank => parseInt(rank.index) < parseInt(cardUserRank.value.index))
    return belowUserRank.length > 0
})

const promote = async () => {
    const aboveUserRank = ranks.value.filter(rank => parseInt(rank.index) > parseInt(cardUserRank.value.index)).sort((a, b) => a.index - b.index)
    if (aboveUserRank.length > 0) {
        const newRank = aboveUserRank[0]
        await updateRankOfUser(props.user.uid, newRank.name)
        cardUserRank.value = newRank
        user.value.rank = await getRankFile(newRank.name)
    }
}

const demote = async () => {
    const belowUserRank = ranks.value.filter(rank => parseInt(rank.index) < parseInt(cardUserRank.value.index)).sort((a, b) => a.index - b.index)
    if (belowUserRank.length > 0) {
        const newRank = belowUserRank[belowUserRank.length - 1]
        await updateRankOfUser(props.user.uid, newRank.name)
        cardUserRank.value = newRank
        user.value.rank = await getRankFile(newRank.name)
    }
}

</script>

<style>

</style>
