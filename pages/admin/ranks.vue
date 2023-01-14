<template>
    <div class="ranks-container">
        <nav class="panel">
            <div class="panel-block">
                <p class="control has-icons-left">
                    <input id="search-perm" class="input" type="text" placeholder="Search" @input="updateSearch">
                    <span class="icon is-small is-left">
                        <i class="fas fa-search" aria-hidden="true" />
                    </span>
                </p>
            </div>
            <div class="panel-tabs">
                <a v-for="rank in allRanks" :key="rank.name" class="tab" :class="{ 'is-active': rank.name === activeTab }" @click="activeTab = rank.name">
                    {{ rank.name }}
                </a>
            </div>
            <rank-permission v-for="permission in allPermissions" :key="generateKey(permission)" :permission="permission.name" :is-enabled="permission.isEnabled" @update="updatePermission" />
            <div class="panel-block buttons">
                <!-- Add permission and rank buttons -->
                <button class="button is-link is-light" @click="addPermission">
                    <span class="icon">
                        <i class="fas fa-plus" />
                    </span>
                    <span>
                        Add permission
                    </span>
                    <span class="icon">
                        <i class="fas fa-user-shield" />
                    </span>
                </button>
                <button class="button is-danger is-light" @click="rmPermission">
                    <span class="icon">
                        <i class="fas fa-minus" />
                    </span>
                    <span>
                        Remove permission
                    </span>
                    <span class="icon">
                        <i class="fas fa-user-shield" />
                    </span>
                </button>
                <button class="button is-link is-light" @click="addRank">
                    <span class="icon">
                        <i class="fas fa-plus" />
                    </span>
                    <span>
                        Add rank
                    </span>
                    <span class="icon">
                        <i class="fas fa-user-tag" />
                    </span>
                </button>
            </div>
        </nav>
        <div class="modal" :class="{'is-active': showModal}">
            <div class="modal-background" @click="showModal = !showModal" />
            <div class="modal-content">
                <div class="box">
                    <div v-if="editingPermission && !removing" class="field">
                        <label id="modal-title" class="label">Permission</label>
                        <div class="control">
                            <input id="modal-input-permission" class="input" type="text" placeholder="Text input">
                        </div>
                    </div>
                    <div v-else-if="!removing" class="field">
                        <label id="modal-title" class="label">Rank</label>
                        <div class="control">
                            <input id="modal-input-rank" class="input" type="text" placeholder="Text input">
                        </div>
                        <div class="field">
                            <label id="modal-title" class="label">Index</label>
                            <div class="control">
                                <input
                                    id="modal-input-rank-index"
                                    class="input"
                                    type="number"
                                    placeholder="Text input"
                                    min="0"
                                    max="999"
                                >
                                <p class="help">
                                    The index of the rank. The lower the index, the higher the rank.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-if="removing" class="field">
                        <label id="modal-title" class="label">Are you sure you want to remove this {{ editingPermission ? 'permission' : 'rank' }}?</label>
                        <div class="control">
                            <input id="modal-input-remove" class="input" type="text" placeholder="Text input">
                            <p class="help">
                                Type the {{ editingPermission ? 'permission' : 'rank' }} name to confirm.
                            </p>
                            <p class="help">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-link" @click="submitChange">
                                Submit
                            </button>
                        </div>
                        <div class="control">
                            <button class="button is-link is-light" @click="showModal = !showModal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import RankPermission from '~/components/admin/rankPermission.vue'

definePageMeta({
    middleware: ['admin_panel'],
    layout: 'admin'
})

const activeTab = ref('user')

/**
 * @typedef {Object} Rank
 * @property {string} name
 * @property {number} index
 * @property {Record<string, boolean>} permissions
 */

/**
 * @typedef {Record<string, boolean>} Permission
 */

const allRanks = ref(/** @type {Rank[]} */ ([]))
const allPermissions = ref(/** @type {Permission[]} */ ([]))
const showModal = ref(false)
const removing = ref(false)
const editingPermission = ref(false)

onMounted(async () => {
    allRanks.value = await getAllRanks()
})

const fetchPermission = () => {
    if (activeTab.value && allRanks.value) {
        const rank = allRanks.value.find(rank => rank.name === activeTab.value)
        if (rank) {
            /**
             * @type {Permission[]}
             */
            const permissions = rank.permissions
            allPermissions.value = Object.keys(permissions).map(permission => ({
                name: permission,
                isEnabled: permissions[permission]
            })).sort((a, b) => {
                const name = a.name.localeCompare(b.name)
                const aRank = a.name.split('.')[0]
                const bRank = b.name.split('.')[0]
                const aRankIndex = aRank === 'admin' ? 3 : aRank === 'mod' ? 2 : aRank === 'user' ? 1 : 0
                const bRankIndex = bRank === 'admin' ? 3 : bRank === 'mod' ? 2 : bRank === 'user' ? 1 : 0
                const rank = bRankIndex - aRankIndex
                return rank === 0 ? name : rank
            })
        }
    }
}

// Let me do it for you ^ ^
//                     ( o O )
//                     (   ============>
//                     (  \___/ )
// Easter egg placed on 2023-1-12 at way to late for a thursday by @RenardFute
watchEffect(() => {
    fetchPermission()
})

const updatePermission = (permission, isEnabled) => {
    if (activeTab.value && allRanks.value) {
        const rank = allRanks.value.find(rank => rank.name === activeTab.value)
        if (rank) {
            rank.permissions[permission] = isEnabled
            updateRank(rank)
        }
    }
}

const updateSearch = async () => {
    const searchText = document.getElementById('search-perm').value
    await fetchPermission()
    if (searchText) {
        allPermissions.value = allPermissions.value.filter(permission => permission.name.toLowerCase().includes(searchText.toLowerCase()))
    }
}

const addPermission = () => {
    editingPermission.value = true
    showModal.value = true
    removing.value = false
}

const rmPermission = () => {
    editingPermission.value = true
    showModal.value = true
    removing.value = true
}

const addRank = () => {
    editingPermission.value = false
    showModal.value = true
    removing.value = false
}

const submitChange = async () => {
    if (editingPermission.value && !removing.value) {
        const newPermission = document.getElementById('modal-input-permission').value
        if (newPermission) {
            await addNewPermission(newPermission)
            allRanks.value = await getAllRanks()
            fetchPermission()
        }
    } else if (!removing.value) {
        const newRank = document.getElementById('modal-input-rank').value
        const newRankIndex = document.getElementById('modal-input-rank-index').value
        if (newRank && newRankIndex) {
            await addNewRank(newRank, newRankIndex)
            allRanks.value = await getAllRanks()
            fetchPermission()
        }
    } else if (editingPermission.value && removing.value) {
        const permission = document.getElementById('modal-input-remove').value
        if (permission) {
            await removePermission(permission)
            allRanks.value = await getAllRanks()
            fetchPermission()
        }
    }
    showModal.value = false
}

const generateKey = (permission) => {
    return permission.name + permission.isEnabled
}
</script>

<style lang="scss" scoped>
    .ranks-container {
        background: #fdfdfd;
        height: 100%;

        .tab {
            text-transform: capitalize;
        }
    }
</style>
