import React from 'react'

interface StepsProps {
  // finished: boolean | null | undefined,
  title: string,
  number: number,
  status: 'active' | 'finished' | 'default';
}

const Steps: React.FC<StepsProps> = ({ title, number, status }) => {
  return (
    <div className='flex items-center px-2 py-1'>
      {status === 'finished' && (
        <div className='bg-primary rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4'>
          <div className=' text-center text-white font-serif font-normal m-0 text-[18px]'>{number}</div>
        </div>

      )}

      {status === 'default' && (
        <div className=' border-primary border-2 bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4'>
          <div className=' text-center text-textPrimary font-serif font-normal m-0 text-[16px]'>{number}</div>
        </div>
      )}

      {status === 'active' && (
        <div className=' bg-lightGray rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4'>
          <div className=' text-center text-textPrimary font-serif font-normal m-0 text-[16px]'>{number}</div>
        </div>

      )}
      <div>
        <div className='text-center font-normal font-serif text-[16px]'>{title}</div>
      </div>
    </div>
  )
}

export default Steps