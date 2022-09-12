<template>
    <div class="card">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <img :src="pdpUrl" alt="Placeholder image">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">{{ user.mc ? user.mc : user.email}}</p>
                    <p class="subtitle is-6" v-if="user.mc">{{ user.email }}</p>
                    <div v-if="user.rank === 'admin'">
                        <span class="tag is-danger">
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fas fa-crown"></i>
                                </span>
                                <span>Admin</span>
                            </span>
                        </span>
                    </div>
                    <div v-else>
                        <span v-if="isHigherRank" class="tag is-warning">{{ user.rank }}</span>
                        <select @change="updateRank" id="rankSelection" v-else>
                            <option v-for="rank in ranks" :value="rank.id" :selected="rank.name === user.rank" v-bind:key="rank">{{ rank.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer" v-if="isHigherRank">
            <div class="card-footer-item">
                <button class="button is-danger is-outlined">
                    <span>Delete</span>
                    <span class="icon is-small">
                        <i class="fas fa-times"></i>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    const pdpUrl = ref("https://crafatar.com/renders/head/853c80ef3c3749fdaa49938b674adae5?size=4&default=MHF_Steve&overlay")

    const ranks = ref([]);

    const userRank = useRank();

    const cardUserRank = ref({});

    const cardUser = ref({});

    const isHigherRank = computed(() => {
        return parseInt(userRank.index) < parseInt(cardUserRank.index);
    })

    const props = defineProps({
        user: {
            type: Object,
            required: true
        }
    })

    onMounted(async () => {
        ranks.value = await getAllRanks();
        //remove all ranks under the user rank
        ranks.value = ranks.value.filter(rank => parseInt(rank.index) >= parseInt(userRank.value.index));
        if(props.user.mc) {
            pdpUrl.value = await get3DHeadFromUsername(props.user.mc)
        }
        cardUserRank.value = await getRankFile(props.user.rank);
    })

    const updateRank = async () => {
        const rankSelection = document.getElementById("rankSelection");
        const rank = rankSelection.options[rankSelection.selectedIndex].text;
        const result = await updateRankOfUser(props.user.uid, rank);
        console.log("result", result);
    }

</script>

<style>

</style>