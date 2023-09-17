<script setup lang="ts">
import pull from 'lodash/pull';
import { ref, computed, watch, onMounted } from 'vue';
import { randomTable } from './random';

const pilots = ref(['Pasha', 'Kolya']);
const pilotInput = ref('');
const addPilot = () => {
	if (pilotInput.value.length > 0 && !pilots.value.includes(pilotInput.value)) {
		pilots.value.push(pilotInput.value);
		pilotInput.value = '';
	}
};

const karts = ref(['1', '2', '3']);
const kartInput = ref('');
const addKart = () => {
	if (kartInput.value.length > 0 && !karts.value.includes(kartInput.value)) {
		karts.value.push(kartInput.value);
		kartInput.value = '';
	}
};

const table = ref([]);
const heats = computed(() => table.value.length);
const computeTable = () => {
	table.value = randomTable(pilots.value, karts.value);
};

const saveState = () => {
	localStorage.setItem('state', JSON.stringify({
		pilots: pilots.value,
		karts: karts.value,
	}));
};

const loadState = () => {
	const data = JSON.parse(localStorage.getItem('state'));
	pilots.value = data?.pilots ?? [];
	karts.value = data?.karts ?? [];
};

const wipeState = () => {
	pilots.value = [];
	karts.value = [];
}

watch([karts, pilots], () => {
	computeTable();
	saveState();
}, { deep: true });

onMounted(() => {
	computeTable();
	loadState();
});
</script>

<template>
	<div class="app">
		<div class="card">
			<h2>Карти</h2>
			<div class="pills">
				<button v-for="kart in karts" class="pills__item" @click="pull(karts, kart)">
					{{ kart }}
				</button>
			</div>
			<div>
				<input v-model="kartInput" @keyup.enter="addKart"/>
				<button @click="addKart">+</button>
			</div>
		</div>
		<div class="card">
			<h2>Пілоти</h2>
			<div class="pills">
				<button v-for="pilot in pilots" class="pills__item" @click="pull(pilots, pilot)">
					{{ pilot }}
				</button>
			</div>
			<div>
				<input v-model="pilotInput" @keyup.enter="addPilot"/>
				<button @click="addPilot">+</button>
			</div>
		</div>
		<div class="card">
			<div class="table">
				<table>
					<thead>
						<th>Хіт / Заїзд</th>
						<th v-for="(_, index) in table">
							№{{ index + 1 }}
						</th>
					</thead>
					<tbody>
						<tr v-for="pilot in pilots">
							<td>{{ pilot }}</td>
							<td v-for="row in table">
								{{ row[pilot] ?? 'X' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<button class="control" @click="computeTable">
				Перемішати
			</button>
			<button class="control" @click="wipeState">
				Очистити
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
$app-width: 800px;

.app {
	max-width: $app-width;
	margin: 1.25em auto;
}

.card {
	padding: 1em;
	border-radius: 5px;
	margin-bottom: 1em;
	background: #FFF;
	overflow: hidden;
}

.pills {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 1em;

	&__item {
		border-radius: 9000px;
		border: 1px solid #ccc;
		padding: 0.25em 0.75em;
		text-align: center;
		margin-bottom: 0.5em;
		margin-right: 0.5em;
		min-width: 2em;

		&:hover:after {
			margin-left: 0.5em;
			content: 'x';
			opacity: 0.5;
		}
	}
}

.control {
	margin-top: 1em;
	font-weight: 1.25em;
	width: 100%;

	& + & {
		margin-top: 0.5em;
	}
}

.table {
	overflow: auto;
	width: 100%;

	table {
		width: 100%;
	}

	th,
	td {
		width: 80px;
	  overflow: hidden;
		padding: 0.25em 0.75em;
		white-space: nowrap;
	  text-overflow: ellipsis;
		text-align: center;
	}
}
</style>
