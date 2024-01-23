import React, { useState } from 'react'
import Steps from '../components/ui/Steps'
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import * as Yup from 'yup';
interface FirstProps { }

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // Uncomment if validating date of birth
}

const First: React.FC<FirstProps> = ({ }) => {
  const navigate = useNavigate();
  const { addFirst } = useActions();

  const [fullName, setFullName] = useState<string>(useTypedSelector((state: any) => state.first.full_name));
  const [email, setEmail] = useState<string>(useTypedSelector((state: any) => state.first.email));
  const [phoneNumber, setPhoneNumber] = useState<string | null>(useTypedSelector((state: any) => state.first.phone_number));
  const dateBirth = useTypedSelector((state: any) => state.first.date_birth);
  const initialDate = dateBirth ? new Date(dateBirth) : null;
  const validInitialDate = initialDate && !isNaN(initialDate.getTime()) ? initialDate : null;
  const [startDate, setStartDate] = useState<Date | null>(validInitialDate);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    dateOfBirth: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .test(
        "DOB",
        "Must be at least 8 years old",
        value => {
          return (
            value &&
            new Date(value).getFullYear() <= new Date().getFullYear() - 8
          );
        }
      )
      .required('Date of birth is required'),
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value);
  };
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNext: React.MouseEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate({
        fullName,
        email,
        phoneNumber,
        dateOfBirth: startDate
      }, { abortEarly: false });
      // If validation passes
      const json = {
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
        date_birth: startDate ? startDate.toISOString() : '', // Convert Date to ISO string
      }
      addFirst(json);
      navigate('/second');
    } catch (err) {
      // Handle validation errors
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
      <div className=' justify-center  items-center flex-col flex'>
        <div className='sm:px-10 max-w-[700px] shadow-lg'>
          <h1 className=' text-[38px] font-bold text-textPrimary text-center sm:text-left font-roboto py-3'>Enrolment Form</h1>
          <div className='flex flex-wrap'>
            <Steps number={1} title='Student Information' status='active' />
            <Steps number={2} title='Address' status='default' />
            <Steps number={3} title='Parent Information' status='default' />
            <Steps number={4} title='Programme Selection' status='default' />
            <Steps number={5} title='Payment' status='default' />
          </div>
          <h2 className='text-[28px] font-bold text-textPrimary font-roboto py-3'>Student Information</h2>
          <div className=' border-t-[1px] border-gray pt-2 text-textPrimary  py-2'>

            <div className='my-6'>
              <p className='font-semibold py-2'>Full Name of Student</p>
              <div className="flex flex-col">
                <input
                  value={fullName}
                  onChange={handleFullName}
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  aria-required="true"
                  aria-invalid="false"
                  className={`w-full px-3 py-2 border ${validationErrors.fullName ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {validationErrors.fullName && <p className="text-red-500">{validationErrors.fullName}</p>}
              </div>
            </div>

            <div className='my-6'>
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
            <div className='sm:grid sm:grid-cols-2'>
              <div className='my-6 sm:my-0 sm:mr-3'>
                <p className='font-semibold py-2'>Phone number</p>
                <div className="flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <PhoneInput
                    country={'gb'}
                    value={phoneNumber}
                    onChange={(phone) => setPhoneNumber(phone)}
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
                      enablesearch: "true",
                      name: 'phone',
                      required: true,
                      autoFocus: true,
                    }}
                  />
                  {validationErrors.phoneNumber && <p className="text-red-500">{validationErrors.phoneNumber}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:ml-3">
                <p className='font-semibold py-2'> Date of Birth</p>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MM/dd/yyyy"
                  dropdownMode="select"
                  showYearDropdown
                  showMonthDropdown
                  maxDate={new Date()}
                  scrollableYearDropdown
                  className="form-input block w-full px-4 py-2 text-base border border-darkGray rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  wrapperClassName="w-full"
                  id="dateOfBirth"
                  popperClassName="react-datepicker-right"
                />
                {validationErrors.dateOfBirth && <p className="text-red-500">{validationErrors.dateOfBirth}</p>}
              </div>
            </div>
            <div className=' my-10 flex justify-end'>

              <div onClick={handleNext} className='px-8 py-2 rounded-full bg-primary cursor-pointer'>
                <div className='text-white font-semibold text-[18px]'>Next</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default First