import init, { vm_instantiate, vm_query } from 'cosmwebwasm';
import { useCallback, useEffect, useState } from 'react';
import { DisplayJson } from '@/components/common/DisplayJson';
import { cloneDeep, reverse } from 'lodash';

let loaded = false;
const run = false;

const codeId = 0x1337;
const sender = 0xc0dec0de;
const address = 0xcafebabe;

let code;

export const LoadVM = () => {
	const [executed, setExecuted] = useState(false);
	const [states, setStates] = useState([]);
	const [events, setEvents] = useState([]);

	const pushState = newState => {
		setStates(prevState => {
			prevState.push(newState);
			return [...prevState];
		});
	};

	const pushEvent = useCallback(newState => {
		setEvents(prevState => {
			prevState.push(newState);
			return [...prevState];
		});
	}, []);

	useEffect(() => {
		if (loaded) return;
		loaded = true;
		getCode(pushState).then(() => {
			init().then(async () => {
				setExecuted(true);
			});
		});
	}, []);

	console.log(states);
	return (
		<div>
			{!executed && <p>loading...</p>}
			{executed && (
				<>
					<div className="flex items-center gap-4">
						<button className="rounded-xl border-explore p-2" onClick={() => instantiate(pushState, pushEvent, states)}>
							<p>INSTANTIATE</p>
						</button>
						<button className="rounded-xl border-explore p-2" onClick={() => getTokenInfo(states)}>
							<p>GET TOKEN INFO</p>
						</button>
					</div>

					<div className="mt-5 flex w-full flex-col items-center gap-5">
						{reverse(
							cloneDeep(states).map((state, i) => (
								<div key={i}>
									<DisplayJson data={parseState(state)} />
								</div>
							))
						)}
					</div>
				</>
			)}
		</div>
	);
};

const parseState = state => {
	state.storage = Object.fromEntries(
		Object.entries(state.storage).map(([k, v]) => [
			k,
			{
				data: Object.fromEntries(
					Object.entries(v.data).map(([k, v]) => [hex_to_ascii(k), JSON.parse(String.fromCharCode(...v))])
				),
				iterators: v.iterators,
			},
		])
	);
	return state;
};

const getCode = async pushState => {
	code = new Uint8Array(await fetch('wasm/cw20_base.wasm').then(x => x.arrayBuffer()));
	pushState({
		storage: {},
		codes: {
			[codeId]: Array.from(code),
		},
		contracts: {
			[address]: {
				code_id: codeId,
				admin: null,
				label: '',
			},
		},
		next_account_id: address + 1,
		transaction_depth: 0,
		gas: {
			checkpoints: [10000000000000],
		},
	});
};

const instantiate = (pushState, pushEvent, states) => {
	const { state: rawState, events: rawEvents } = vm_instantiate(
		sender,
		address,
		[],
		JSON.stringify(states[states.length - 1]),
		code,
		JSON.stringify({
			name: 'Picasso',
			symbol: 'PICA',
			decimals: 12,
			initial_balances: [],
			mint: {
				minter: String(sender),
				cap: null,
			},
			marketing: null,
		})
	);
	normalize(rawState);
	pushState(rawState);
	pushEvent(rawEvents);
};

async function getTokenInfo(states) {
	const tokenInfo = JSON.parse(
		atob(
			vm_query(sender, address, [], JSON.stringify(states[states.length - 1]), code, {
				wasm: {
					smart: {
						contract_addr: String(address),
						msg: btoa(
							JSON.stringify({
								token_info: {},
							})
						),
					},
				},
			})
		)
	);
	console.log('-- Token info --');
	log(tokenInfo);
}

// Weird rust interop creating maps...
function normalize(state) {
	state.codes = Object.fromEntries(state.codes);
	state.contracts = Object.fromEntries(state.contracts);
	state.storage = Object.fromEntries(state.storage);
	state.storage = Object.fromEntries(
		Object.entries(state.storage).map(([k, v]) => [
			k,
			{
				data: Object.fromEntries(v.data),
				iterators: Object.fromEntries(v.iterators),
			},
		])
	);
}

function log(x) {
	console.log(JSON.stringify(x, null, 4));
}
function hex_to_ascii(str1) {
	const hex = str1.toString();
	let str = '';
	for (let n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}
