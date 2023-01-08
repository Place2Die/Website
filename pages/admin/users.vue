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

    onMounted(async () => {
        let userList = await getAllUsers();
        users.value = userList.sort((a, b) => {
            let rankSort = b.rank.index - a.rank.index;
            if(rankSort !== 0) return rankSort;
            if (a.mc && b.mc) {
                return a.mc.localeCompare(b.mc);
            } else {
                return a.email.localeCompare(b.email);
            }
        });
    })

    const updateSearch = async () => {
        users.value = await getAllUsers();
        users.value = users.value.sort((a, b) => {
            let rankSort = b.rank.index - a.rank.index;
            if(rankSort !== 0) return rankSort;
            if (a.mc && b.mc) {
                return a.mc.localeCompare(b.mc);
            } else {
                return a.email.localeCompare(b.email);
            }
        });
        if(searchText.value.length > 0) {
            users.value = users.value.filter(user => {
                return user.email.toLowerCase().includes(searchText.value.toLowerCase()) || user.mc.toLowerCase().includes(searchText.value.toLowerCase()) || user.discord.toLowerCase().includes(searchText.value.toLowerCase());
            })
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
        padding: 1rem;

        .user {
            margin: 1rem 0;
            width: 100%;
        }
    }

</style>