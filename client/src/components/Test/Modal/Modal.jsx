import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { NavLink } from 'react-router-dom'

export default function MyModal({ isOpen, onClose, test, atts }) {
    // Проверка наличия попыток
    const hasAttempts = Array.isArray(atts) && atts.length > 0;

    return (
        <Dialog
            open={isOpen}
            as='div'
            className='relative z-10 focus:outline-none'
            onClose={() => false}
        >
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-4'>
                    {hasAttempts ? (
                        <DialogPanel
                            className='w-full max-w-md rounded-xl bg-gray-400 p-6 duration-300 ease-out'
                        >
                            <DialogTitle
                                as='h3'
                                className='text-base/7 font-medium text-black'
                            >
                                Готовы начать тест?
                            </DialogTitle>
                            <p className='mt-2 text-sm/6 text-gray-700'>
                                Вы хотите начать тест{' '}
                                <span className='text-white font-semibold'>{test?.name}</span>,
                                где создатель теста:{' '}
                                <span className='text-black'>{test?.created_by}</span>
                                <br />
                                <span className='font-semibold'>
                                    Осталось попыток: {atts[0]?.attempts}
                                </span>
                            </p>
                            <div className='mt-4'>
                                <Button
                                    className='inline-flex items-center gap-2 rounded-md bg-gray-300 py-1.5 px-3 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-500'
                                    onClick={onClose}
                                >
                                    Да, Готов!
                                </Button>
                                <NavLink
                                    to={'/main'}
                                    className='inline-flex items-center gap-2 rounded-md bg-gray-300 py-1.5 px-3 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-500 ml-2'
                                >
                                    Отмена
                                </NavLink>
                            </div>
                        </DialogPanel>
                    ) : (
                        <div className='w-full max-w-md rounded-xl bg-gray-400 p-6'>
                            <h3 className='text-base/7 font-medium text-black'>
                                Ой, у вас похоже нет попыток для этого теста.
                            </h3>
                            <NavLink
                                to={'/main'}
                                className='inline-flex items-center rounded-md bg-gray-300 py-1.5 px-3 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-500 mt-1'
                            >
                                Назад
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
