import React, { useEffect, useState } from 'react'
import Steps from '../components/ui/Steps'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useNavigate } from 'react-router-dom'
import { useActions } from '../hooks/useActions'
import { useTypedSelector } from '../hooks/useTypedSelector'
import * as Yup from 'yup';

interface ThirdProps { }

interface ValidationErrors {
  full_name?: string;
  email?: string;
  number?: string;
}

const Third: React.FC<ThirdProps> = ({ }) => {
  const navigate = useNavigate();
  const { addThird } = useActions();

  const [fullName, setFullName] = useState<string>(useTypedSelector((state: any) => state.third.full_name));
  const [email, setEmail] = useState<string>(useTypedSelector((state: any) => state.third.email));
  const [number, setNumber] = useState<string>(useTypedSelector((state: any) => state.third.number));

  const [second] = useState<string>(useTypedSelector((state: any) => state.second));

  useEffect(() => {
    const isFirstStateFull = second && Object.values(second).every(value => value !== null && value !== '');
    if (!isFirstStateFull) {
      navigate('/second');
    }
  }, [navigate, second])

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    number: Yup.string().required('Contact number is required')
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      full_name: ""
    }));
    setFullName(event.target.value);
  };
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      email: ""
    }));
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (phone: string) => {
    setNumber(phone);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      number: ""
    }));
  };

  const handlePrevious = () => {
    navigate('/second');
  };

  const handleNext: React.MouseEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();

    try {
      await validationSchema.validate({ full_name: fullName, email, number }, { abortEarly: false });
      const json = {
        full_name: fullName,
        email,
        number
      };
      addThird(json);
      navigate('/fourth');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = err.inner.reduce((acc, error) => {
          if (typeof error.path === 'string') {
            return {
              ...acc,
              [error.path]: error.message
            };
          }
          return acc;
        }, {});
        setValidationErrors(errors);
      }
    }
  };


  return (
    <div className='px-6 animate-fade-in'>
      <div className=' justify-center items-center flex-col flex'>
        <div className='sm:px-10 max-w-[700px] shadow-lg'>
          <h1 className=' text-[38px] font-bold text-primary text-center font-roboto py-3'>Enrolment Form</h1>
          <div className='flex flex-wrap'>
            <Steps number={1} title='Student Information' status='finished' />
            <Steps number={2} title='Address' status='finished' />
            <Steps number={3} title='Parent Information' status='active' />
            <Steps number={4} title='Programme Selection' status='default' />
            <Steps number={5} title='Payment' status='default' />
          </div>
          <h2 className='text-[28px] font-bold text-textPrimary font-roboto py-3'>Parent/Guardian Information</h2>
          <div className=' border-t-[1px] border-gray pt-2 text-textPrimary py-2'>
            <div className='my-6'>
              <p className='font-semibold py-2'>Full Name of Parent</p>
              <div className="flex flex-col">
                <input
                  value={fullName}
                  onChange={handleFullName}
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  aria-required="true"
                  aria-invalid="false"
                  className={`w-full px-3 py-2 border ${validationErrors.full_name ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {validationErrors.full_name && <p className="text-red-500">{validationErrors.full_name}</p>}
              </div>
            </div>
            <div className='sm:grid sm:grid-cols-2'>
              <div className='my-6 sm:my-0 sm:mr-3'>
                <p className='font-semibold py-2'>Email Address</p>
                <div className="flex flex-col">
                  <input
                    value={email}
                    onChange={handleEmail}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    aria-required="true"
                    aria-invalid="false"
                    className={`w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
                </div>
              </div>

              <div className='my-6 sm:my-0 sm:ml-3'>
                <p className='font-semibold py-2'>Contact number</p>
                <div className="flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <PhoneInput
                    value={number}
                    onChange={handlePhoneNumberChange}
                    country={'gb'}
                    placeholder={'Phone number'}
                    dropdownStyle={{
                      fontSize: '1rem'
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      boxShadow: 'none',
                      fontSize: '1rem'
                    }}
                    inputProps={{
                      enableSearch: true,
                      name: 'phone',
                      required: true,
                      autoFocus: true,
                    }}
                  />
                  {validationErrors.number && <p className="text-red-500">{validationErrors.number}</p>}
                </div>
              </div>

            </div>

            <div className=' my-10 flex justify-between'>
              <div onClick={handlePrevious} className='px-8 py-2 mx-4 group rounded-xl bg-gray hover:bg-darkGray duration-150 cursor-pointer'>
                <div className='text-black group-hover:text-white font-semibold text-[18px]'>Previous</div>
              </div>
              <div onClick={handleNext} className='px-8 py-2 rounded-full bg-primary cursor-pointer'>
                <div className='text-white font-semibold text-[18px]'>Submit</div>
              </div>

            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default Third