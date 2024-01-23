import React, { useEffect, useMemo, useState } from 'react'
import Steps from '../components/ui/Steps'
import countryList from 'react-select-country-list'
import { useNavigate } from 'react-router-dom';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import * as Yup from 'yup';
interface SecondProps {
}
interface CountryData {
  label: string;
  value: string
}

interface ValidationErrors {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  current_school?: string;
}

const Second: React.FC<SecondProps> = ({ }) => {
  const navigate = useNavigate();

  const [first] = useState<string>(useTypedSelector((state: any) => state.first));
  useEffect(() => {
    const isFirstStateFull = first && Object.values(first).every(value => value !== null && value !== '');
    if (!isFirstStateFull) {
      navigate('/');
    }
  }, [navigate, first])

  const { addSecond } = useActions();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedCountry, setSelectedCountry] = useState<string>(useTypedSelector((state: any) => state.second.country));
  const [street, setStreet] = useState<string>(useTypedSelector((state: any) => state.second.street));
  const [city, setCity] = useState<string>(useTypedSelector((state: any) => state.second.city));
  const [state, setState] = useState<string>(useTypedSelector((state: any) => state.second.state));
  const [zip, setZip] = useState<string>(useTypedSelector((state: any) => state.second.zip));
  const [current_school, setCurrentSchool] = useState<string>(useTypedSelector((state: any) => state.second.current_school));


  const validationSchema = Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('ZIP/Postal Code is required'),
    country: Yup.string().required('Country is required'),
    current_school: Yup.string().required('Full name of current school is required')
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const handleSelectCountry = (label: string) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      country: ""
    }));
    setSelectedCountry(label);
    toggleDropdown();
  };
  const options = useMemo(() => countryList().getData(), []);
  const filteredItems: CountryData[] = options.filter(item =>
    item.label.toLowerCase().includes(searchTerm)
  );

  const handleStreet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      street: ""
    }));
    setStreet(event.target.value);
  };


  const handleCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      city: ""
    }));
    setCity(event.target.value);
  };
  const handleState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      state: ""
    }));
    setState(event.target.value);
  };
  const handleZip = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      zip: ""
    }));
    setZip(event.target.value);
  };

  const handleCurrentSchool = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      current_school: ""
    }));
    setCurrentSchool(event.target.value);
  };

  const handleNext: React.MouseEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();

    try {
      await validationSchema.validate({
        street, city, state, current_school, zip, country: selectedCountry
      }, { abortEarly: false });

      // If validation passes
      const json = {
        street, city, state, current_school, zip, country: selectedCountry
      };
      addSecond(json);
      navigate('/third');
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


  const handlePrevious = () => {
    navigate('/');
  };

  return (
    <div className='px-6 animate-fade-in'>
      <div className=' justify-center items-center flex-col flex'>
        <div className='sm:px-10 max-w-[700px] shadow-lg'>
          <h1 className=' text-[38px] font-bold text-primary text-center font-roboto py-3'>Enrolment Form</h1>
          <div className='flex flex-wrap'>
            <Steps number={1} title='Student Information' status='finished' />
            <Steps number={2} title='Address' status='active' />
            <Steps number={3} title='Parent Information' status='default' />
            <Steps number={4} title='Programme Selection' status='default' />
            <Steps number={5} title='Payment' status='default' />
          </div>
          <h2 className='text-[28px] font-bold text-textPrimary font-roboto py-3'>Address</h2>
          <div className=' border-t-[1px] border-gray pt-2 py-2 text-textPrimary'>
            <div className='my-6'>
              <p className='font-semibold py-2'>Street</p>
              <div className="flex flex-col">
                <input
                  value={street}
                  onChange={handleStreet}
                  name="street"
                  type="text"
                  placeholder="Street"
                  aria-required="true"
                  aria-invalid="false"
                  className={`w-full px-3 py-2 border ${validationErrors.street ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {validationErrors.street && <p className="text-red-500">{validationErrors.street}</p>}
              </div>
            </div>

            <div className='my-6'>
              <p className='font-semibold py-2'>City</p>
              <div className="flex flex-col">
                <input
                  value={city}
                  onChange={handleCity}
                  name="city"
                  type="text"
                  placeholder="City"
                  aria-required="true"
                  aria-invalid="false"
                  className={`w-full px-3 py-2 border ${validationErrors.city ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {validationErrors.city && <p className="text-red-500">{validationErrors.city}</p>}
              </div>
            </div>

            <div className='my-6'>
              <p className='font-semibold py-2'>Region</p>
              <div className="flex flex-col">
                <input
                  value={state}
                  onChange={handleState}
                  name="state"
                  type="text"
                  placeholder="State"
                  aria-required="true"
                  aria-invalid="false"
                  className={`w-full px-3 py-2 border ${validationErrors.state ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {validationErrors.state && <p className="text-red-500">{validationErrors.state}</p>}

              </div>
            </div>


            <div className='sm:grid sm:grid-cols-2'>
              <div className='my-6 sm:my-0 sm:mr-3'>
                <p className='font-semibold py-2'>ZIP / Postal Code</p>
                <div className="flex flex-col">
                  <input
                    value={zip}
                    onChange={handleZip}
                    name="zip"
                    type="text"
                    placeholder="Enter Zip Code"
                    aria-required="true"
                    aria-invalid="false"
                    className={`w-full px-3 py-2 border ${validationErrors.zip ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {validationErrors.zip && <p className="text-red-500">{validationErrors.zip}</p>}
                </div>
              </div>

              <div className="w-[300px] sm:ml-3">
                <div className="relative group">
                  <p className='font-semibold py-2'>Country</p>

                  <button
                    id="dropdown-button"
                    className={`inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border ${validationErrors.country ? 'border-red-500' : 'border-darkGray'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500`}
                    onClick={toggleDropdown}
                  >
                    {validationErrors.country && <p className="text-red-500">{validationErrors.country}</p>}
                    <span className={"mr-2" + selectedCountry === null ? 'text-darkGray' : 'text-textPrimary'}>{selectedCountry === null ? "Open Dropdown" : selectedCountry}</span>
                    <div className='flex justify-center items-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setSelectedCountry('')} className="w-4 h-4 text-darkGray hover:text-red-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <line x1="3" y1="3" x2="17" y2="17" />
                        <line x1="3" y1="17" x2="17" y2="3" />
                      </svg>

                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 -mr-1 " viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {isOpen && (
                    <div id="dropdown-menu" className="absolute flex flex-col  h-60 overflow-scroll left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1">
                      <input
                        id="search-input"
                        className="block w-full px-4 py-2 text-gray-800 border rounded-md  border-darkGray focus:outline-none"
                        type="text"
                        placeholder="Search items"
                        autoComplete="off"
                        onChange={handleSearch}
                      />
                      {filteredItems.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectCountry(item.label)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className='my-6'>
              <p className='font-semibold py-2'>Full Name Of Current School</p>
              <div className="flex flex-col">
                <input
                  value={current_school}
                  onChange={handleCurrentSchool}
                  name="current_school"
                  type="text"
                  placeholder="Full Name Of Current School"
                  aria-required="true"
                  aria-invalid="false"
                  className={`w-full px-3 py-2 border ${validationErrors.current_school ? 'border-red-500' : 'border-darkGray'} rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {validationErrors.current_school && <p className="text-red-500">{validationErrors.current_school}</p>}

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

export default Second