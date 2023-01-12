<template>
    <div class="users">
        <div id="searchbar" class="control has-icons-left has-icons-right">
            <input
                v-model="searchText"
                class="input"
                type="text"
                placeholder="Search for someone"
                @input="updateSearch"
            >
            <span class="icon is-small is-left">
                <i class="fas fa-magnifying-glass" />
            </span>
        </div>
        <div id="list-container">
            <div id="fade-top" />
            <div id="user-list">
                <admin-user-card
                    v-for="user in users"
                    :key="user.id"
                    class="user"
                    :user="user"
                    @open-modal="openModal(user)"
                />
            </div>
        </div>
        <div class="modal" :class="{'is-active': showModal}">
            <div class="modal-background" @click="showModal = !showModal" />
            <div class="modal-content">
                <div class="box">
                    <div class="field">
                        <label id="modal-title" class="label">Username</label>
                        <div class="control">
                            <input id="modal-input" class="input" type="text" placeholder="Text input">
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

import { setUserMinecraft, setUserDiscord } from '~/composables/useFirebaseAdmin'

const users = ref([])

const searchText = ref('')

const showModal = ref(false)
const editingUser = ref(null)

const openModal = (user) => {
    showModal.value = true
    editingUser.value = user
}

definePageMeta({
    middleware: ['admin_panel'],
    layout: 'admin'
})

onMounted(async () => {
    const userList = await getAllUsers()
    users.value = userList.sort((a, b) => {
        const rankSort = b.rank.index - a.rank.index
        if (rankSort !== 0) { return rankSort }
        if (a.mc && b.mc) {
            return a.mc.localeCompare(b.mc)
        } else {
            return a.email.localeCompare(b.email)
        }
    })
})

const updateSearch = async () => {
    users.value = await getAllUsers()
    users.value = users.value.sort((a, b) => {
        const rankSort = b.rank.index - a.rank.index
        if (rankSort !== 0) { return rankSort }
        if (a.mc && b.mc) {
            return a.mc.localeCompare(b.mc)
        } else {
            return a.email.localeCompare(b.email)
        }
    })
    if (searchText.value.length > 0) {
        const search = searchText.value.toLowerCase()
        users.value = users.value.filter((user) => {
            return user.email.toLowerCase().includes(search) ||
                    user.mc.toLowerCase().includes(search) ||
                    user.discord.toLowerCase().includes(search)
        })
    }
}

const submitChange = () => {
    const inputField = document.getElementById('modal-input')
    const inputType = document.getElementById('modal-title').innerText
    const targetUser = editingUser.value

    switch (inputType) {
    case 'Username':
        if (inputField.value.length > 0) {
            setUserMinecraft(targetUser.uid, inputField.value)
        }
        break
    case 'Discord':
        if (inputField.value.length > 0) {
            setUserDiscord(targetUser.uid, inputField.value)
        }
        break
    case 'Email':/*
                if (inputField.value.length > 0) {
                    setUserMail(targetUser.uid, inputField.value);
                } */
        break
    }
    showModal.value = false
    editingUser.value = null
    if (inputField.value.length > 0) {
        updateSearch()
    }
}
</script>

<style lang="scss" scoped>

    .users {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding: 1rem 1rem 0 1rem;

        .user {
            margin: 1rem 0;
            width: 100%;
        }

        #user-list {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            padding-right: 1rem;
            position: relative;
        }

        #list-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
            overflow-y: hidden;
            position: relative;

            #fade-top {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2rem;
                background: linear-gradient(to bottom, #161b22, transparent);
                z-index: 2;
            }
        }

        #user-list::-webkit-scrollbar {
          width: 12px;
        }
        #user-list::-webkit-scrollbar-track {
          background: #161b22;
          padding: 0 10px;
        }
        #user-list::-webkit-scrollbar-thumb {
          background-color: #0d1117;
          border-radius: 20px;
          border: 3px solid #161b22;
        }

        #searchbar {
            margin-bottom: 1rem;
            margin-right: 2rem;
        }
    }

</style>
