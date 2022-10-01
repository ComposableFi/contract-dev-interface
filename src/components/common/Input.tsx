import { Path, PathValue, useForm, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Img } from '@/components/common/Img';
import { useCallback, useEffect, useState } from 'react';

interface InputProps {
	onEnter: (input: string) => void;
	placeholder: string;
	defaultValue?: string;
	SVG: ({ className }: { className: string }) => JSX.Element;
}

export const Input = ({ onEnter, placeholder, SVG, defaultValue = '' }: InputProps) => {
	const {
		getValues: getFormValues,
		register,
		setValue,
		watch,
	} = useForm<{ input: string }>({
		mode: 'all',
		defaultValues: { input: defaultValue },
	});

	return (
		<RawSingleInput
			placeholder={placeholder}
			onEnter={onEnter}
			register={register}
			getFormValues={getFormValues}
			setValue={setValue}
			watch={watch}
			property={'input'}
		/>
	);
};

interface RawInputProps<T extends Record<string, string>> {
	onEnter: (input: string) => void;
	placeholder: string;
	onFocus?: (focusFunc: () => void) => void;
	register: UseFormRegister<T>;
	getFormValues: () => T;
	setValue: UseFormSetValue<T>;
	watch: UseFormWatch<T>;
	property: Path<T>;
}

export function RawSingleInput<T extends Record<string, string>>({
	onEnter,
	placeholder,
	register,
	getFormValues,
	setValue,
	watch,
	property,
}: RawInputProps<T>) {
	const [hasValue, setHasValue] = useState(false);
	const onClearInput = useCallback(() => {
		setValue(property, '' as PathValue<T, Path<T>>);
		onEnter('');
		setHasValue(false);
	}, [onEnter]);

	useEffect(() => {
		const subscription = watch(value => {
			if (value?.[property] === '') setHasValue(false);
			else setHasValue(true);
		});
		return () => subscription.unsubscribe();
	}, [watch]);
	return (
		<div className="relative flex h-16 w-full grow gap-6 rounded-2xl border-2 border-titanium.3 px-6 py-[18px]">
			<input
				onKeyDown={e => {
					if (e.key === 'Enter') {
						const input = getFormValues()?.[property];
						onEnter(`${input}`);
					} else if (e.key === 'Escape') {
						onClearInput();
					}
				}}
				{...register(property, {
					required: true,
					onBlur: e => {
						if (e.target.value === '') {
							onClearInput();
						}
					},
				})}
				className="large h-full w-full bg-transparent text-titanium.6 placeholder:text-titanium.6"
				placeholder={placeholder}
			/>
			{hasValue && (
				<figure className="absolute right-[24px] top-[50%] h-6 w-6 translate-y-[-50%]">
					<button tabIndex={-1} type="button" onClick={onClearInput}>
						<Img src={'/icons/Close.svg'} />
					</button>
				</figure>
			)}
		</div>
	);
}
