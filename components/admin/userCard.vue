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
                    <p class="title is-4">
                        {{ user.mc ? user.mc : user.email }}</p>
                    <p class="subtitle is-6" v-if="user.mc">{{ user.email }}</p>
                    <div class="tags">
                        <span class="tag" :class="{'is-danger' : user.rank.name === 'admin', 'is-warning': user.rank.name !== 'user'}">
                            <span class="icon-text">
                                <span class="icon">
                                    <i v-if="user.rank.name === 'admin'" class="fas fa-crown"></i>
                                    <i v-else-if="user.rank.name === 'moderator'" class="fas fa-shield-alt"></i>
                                    <i v-else class="fas fa-user"></i>
                                </span>
                                <span style="text-transform: capitalize">{{ user.rank.name }}</span>
                            </span>
                        </span>
                        <span class="tag is-link" v-if="user.discord">
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fa-brands fa-discord"></i>
                                </span>
                                <span>{{ user.discord }}</span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer" v-if="!isCardRankHigher">
            <div class="card-footer-item">
                <button class="button is-danger">
                    <span>Delete</span>
                    <span class="icon is-small">
                      <i class="fas fa-times"></i>
                  </span>
                </button>
            </div>
            <div class="card-footer-item" v-if="canBePromoted">
                <button class="button is-success"  @click="promote">
                    <span>Promote</span>
                    <span class="icon is-small">
                        <i class="fas fa-arrow-up"></i>
                    </span>
                </button>
            </div>
            <div class="card-footer-item" v-if="canBeDemoted">
                <button class="button is-warning" @click="demote">
                    <span>Demote</span>
                    <span class="icon is-small">
                        <i class="fas fa-arrow-down"></i>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

import {updateRankOfUser} from "~/composables/useFirebase";

const pdpUrl = ref("https://crafatar.com/renders/head/853c80ef3c3749fdaa49938b674adae5?size=4&default=MHF_Steve&overlay")

const ranks = ref([]);

const userRank = useRank();

const cardUserRank = ref({});

const cardUser = ref({});

const isCardRankHigher = computed(() => {
    if (!userRank || !cardUserRank) return false;
    return userRank.value.index <= cardUserRank.value.index;
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
    ranks.value = ranks.value.filter(rank => parseInt(rank.index) <= parseInt(userRank.value.index));
    if (props.user.mc) {
        try {
            pdpUrl.value = await get3DHeadFromUsername(props.user.mc)
        } catch (e) {
            console.log(e)
        }
    }
    cardUserRank.value = props.user.rank;
})

const canBePromoted = computed(() => {
    if (!cardUserRank)
        return false;
    const aboveUserRank = ranks.value.filter(rank => parseInt(rank.index) > parseInt(cardUserRank.value.index));
    return aboveUserRank.length > 0;
})

const canBeDemoted = computed(() => {
    if (!cardUserRank)
        return false;
    const belowUserRank = ranks.value.filter(rank => parseInt(rank.index) < parseInt(cardUserRank.value.index));
    return belowUserRank.length > 0;
})

const promote = async () => {
    const aboveUserRank = ranks.value.filter(rank => parseInt(rank.index) > parseInt(cardUserRank.value.index)).sort((a, b) => a.index - b.index);
    if (aboveUserRank.length > 0) {
        const newRank = aboveUserRank[0];
        await updateRankOfUser(props.user.uid, newRank.name);
        cardUserRank.value = newRank;
        props.user.rank = newRank.name;
    }
}

const demote = async () => {
    const belowUserRank = ranks.value.filter(rank => parseInt(rank.index) < parseInt(cardUserRank.value.index)).sort((a, b) => b.index - a.index);
    if (belowUserRank.length > 0) {
        const newRank = belowUserRank[belowUserRank.length - 1];
        await updateRankOfUser(props.user.uid, newRank.name);
        cardUserRank.value = newRank;
        props.user.rank = await getRankFile(newRank.name);
    }
}

</script>

<style>

</style>