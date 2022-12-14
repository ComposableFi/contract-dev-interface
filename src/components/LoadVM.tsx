import init, { vm_execute, vm_instantiate, vm_query } from 'cosmwebwasm';
import { useEffect, useState } from 'react';
import { DisplayJson } from '@/components/common/DisplayJson';
import { cloneDeep, reverse } from 'lodash';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { RawSingleInput } from '@/components/common/Input';
import { useForm } from 'react-hook-form';

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

	const pushEvent = newState => {
		setEvents(_ => newState);
	};

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
					<Interactions states={states} pushState={pushState} pushEvent={pushEvent} />
					<DisplayData states={states} events={events} />
				</>
			)}
		</div>
	);
};

interface Inputs {
	recipient: string;
	amount: string;
}

const Interactions = ({ pushEvent, pushState, states }) => {
	const {
		getValues: getFormValues,
		register,
		setValue,
		watch,
	} = useForm<Inputs>({
		mode: 'all',
		defaultValues: {
			recipient: '10001',
			amount: '5555',
		},
	});

	const onEnter = () => {
		const values = getFormValues();
		console.log(values);
		execute(pushState, pushEvent, states, {
			mint: {
				recipient: values.recipient,
				amount: values.amount,
			},
		});
	};

	return (
		<div className="flex flex-col items-center gap-5">
			<div className="grid w-full grid-cols-2 gap-2">
				<div>
					<p>Recipient</p>
					<RawSingleInput
						getFormValues={getFormValues}
						setValue={setValue}
						watch={watch}
						register={register}
						placeholder=""
						onEnter={onEnter}
						property="recipient"
					/>
				</div>
				<div>
					<p>Amount</p>
					<RawSingleInput
						getFormValues={getFormValues}
						setValue={setValue}
						watch={watch}
						register={register}
						placeholder=""
						onEnter={onEnter}
						property="amount"
					/>
				</div>
			</div>
			<div className="flex items-center justify-center gap-4">
				<button
					className="rounded-xl border border-explore p-4 transition-opacity duration-200 hover:opacity-80"
					onClick={() =>
						instantiate(pushState, pushEvent, states, {
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
					}>
					<p>INSTANTIATE</p>
				</button>
				<button
					className="rounded-xl border border-explore p-4 transition-opacity duration-200 hover:opacity-80"
					onClick={() => onEnter()}>
					<p>EXECUTE</p>
				</button>
				<button
					className="rounded-xl border border-explore p-4 transition-opacity duration-200 hover:opacity-80"
					onClick={() => getTokenInfo(states)}>
					<p>QUERY</p>
				</button>
			</div>
		</div>
	);
};

const DisplayData = ({ states, events }) => {
	const [ref] = useAutoAnimate<HTMLDivElement>();
	const [ref2] = useAutoAnimate<HTMLDivElement>();
	return (
		<div className="grid w-full grid-cols-[minmax(40vw,100vw),minmax(40vw,100vw)] gap-2">
			<div
				ref={ref}
				className="mt-5 flex w-full w-full min-w-[500px] flex-col items-center gap-5 rounded-xl border border-hexplore px-8 py-5">
				<p className="w-full text-center font-metropolis text-[20px]">State Updates</p>
				{reverse(
					cloneDeep(states).map((state, i) => (
						<div key={`state_${i}`}>
							<DisplayJson data={parseState(state)} />
						</div>
					))
				)}
			</div>
			<div
				ref={ref2}
				className="mt-5 flex h-fit w-full w-full min-w-[419px] flex-col items-center gap-5 rounded-xl border border-hexplore px-8 py-5">
				<p className="w-full text-center font-metropolis text-[20px]">Latest Event</p>
				{reverse(
					cloneDeep(events).map((event, i) => (
						<div key={`event_${i}`}>
							<DisplayJson data={event} />
						</div>
					))
				)}
				{events.length === 0 && <p>Empty Ser</p>}
			</div>
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

const execute = (pushState, pushEvent, states, obj) => {
	try {
		const { state: rawState, events: rawEvents } = vm_execute(
			sender,
			address,
			[],
			JSON.stringify(states[states.length - 1]),
			code,
			JSON.stringify(obj)
		);

		normalize(rawState);
		pushState(rawState);
		pushEvent(rawEvents);
	} catch (ex) {
		console.log('probably invalid json ser');
		console.error(ex);
	}
};

const instantiate = (pushState, pushEvent, states, obj) => {
	const { state: rawState, events: rawEvents } = vm_instantiate(
		sender,
		address,
		[],
		JSON.stringify(states[states.length - 1]),
		code,
		JSON.stringify(obj)
	);
	normalize(rawState);
	pushState(rawState);
	pushEvent(rawEvents);
	console.log(rawEvents);
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
