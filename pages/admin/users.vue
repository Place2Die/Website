<template>
    <div class="users">
        <div class="control has-icons-left has-icons-right">
            <input class="input" type="text" placeholder="Search for someone"
            v-model="searchText"
            @input="updateSearch">
            <span class="icon is-small is-left">
                <i class="fas fa-magnifying-glass"></i>
            </span>
        </div>
        <admin-user-card class="user" v-for="user in users" :user="user" :key="user.id" />
    </div>
</template>

<script setup>

    const users = ref([]);

    const searchText = ref("");

    definePageMeta({
        middleware: ["admin_panel"],
        layout: "admin"
    })

    const updateSearch = async () => {
        users.value = await getAllUsers();
        if(searchText.value.length > 0) {
            users.value = users.value.filter(user => {
                return user.email.toLowerCase().includes(searchText.value.toLowerCase()) || user.mc.toLowerCase().includes(searchText.value.toLowerCase()) || user.discord.toLowerCase().includes(searchText.value.toLowerCase());
            })
        }
    }

    onMounted(async () => {
        const userList = await getAllUsers();
        users.value = userList;
    })
</script>

<style lang="scss" scoped>

    .users {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding: 1rem;

        .user {
            margin: 1rem 0;
            width: 100%;
        }
    }

</style>