import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'
import groups from '../../hoc/Auth/assets/groups'

const people = [...groups]

export default function ComboboxCustom(props) {
	const [query, setQuery] = useState('')

	const filteredPeople =
		query === ''
			? people
			: people.filter(person => {
					return person.toLowerCase().includes(query.toLowerCase())
			  })

	return (
		<div className='mx-auto mb-10 w-full'>
			<Combobox
				value={props.selected}
				onChange={props.selectedValue}
				onClose={() => setQuery('')}
			>
				<div className='relative'>
					<ComboboxInput
						className={clsx(
							'w-full rounded-lg border-none bg-black/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
							'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
						)}
						displayValue={person => person}
						onChange={event => setQuery(event.target.value)}
					/>
					<ComboboxButton className='group absolute inset-y-0 right-0 px-2.5'>
						<ChevronDownIcon className='size-4 fill-black/60 group-data-[hover]:fill-black' />
					</ComboboxButton>
				</div>

				<ComboboxOptions
					anchor='bottom'
					transition
					className={clsx(
						'w-[var(--input-width)] rounded-xl mt-2 border border-white/5 bg-blue-500 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
						'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
					)}
				>
					{filteredPeople.map(person => (
						<ComboboxOption
							key={Math.random()}
							value={person}
							className='group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/40'
						>
							<CheckIcon className='invisible size-4 fill-black group-data-[selected]:visible' />
							<div className='text-sm/6 text-white'>{person}</div>
						</ComboboxOption>
					))}
				</ComboboxOptions>
			</Combobox>
		</div>
	)
}
