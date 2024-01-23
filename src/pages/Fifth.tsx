import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Steps from '../components/ui/Steps';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../hooks/useTypedSelector';
import SuccessPayment from '../components/ui/SuccessPayment';
import { useActions } from '../hooks/useActions';


interface Metadata1Type {
  full_name: string;
  email: string;
  date_birth: string;
  phone_number: string;
}
interface Metadata2Type {
  city: string;
  country: string;
  state: string;
  street: string;
  zip: string;
  current_school: string;
}
interface Metadata3Type {
  email: string;
  full_name: string;
  number: string;
}
interface WeekData {
  label: string;
  price: number;
}
interface Metadata4Type {
  curriculum: string;
  programm_name: string;
  weeks: WeekData[]; // Array of objects, not Array of strings
}

// Ensure you add your own Stripe public key
const stripePromise = loadStripe('pk_test_51LTQAVJZHzTr0YFx4S0AZgL4a47LLVDdH3bTvcytFQdvpiWW9l7KLChH9bFL6aTY2C8R1mExdCU2DvWufY5sdAQ500qAwd0zfR');

const CustomCardForm = () => {
  const { clearFirst, clearSecond, clearThird, clearFourth } = useActions();


  const array = useTypedSelector((state: any) => state.fourth.weeks)
  let convertedObject = array.reduce((obj: any, item: any) => {
    obj[item.label] = { price: item.price, selected: true };
    return obj;
  }, {});
  const [selectedWeeks] = useState<Record<string, { price: number, selected: boolean }>>(convertedObject);
  const calculateTotalPrice = () => {
    return Object.values(selectedWeeks)
      .filter(week => week.selected)
      .reduce((total, week) => total + week.price, 0);
  };
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [programm_name] = useState<string>(useTypedSelector((state: any) => state.fourth.programm_name));
  const [curriculum] = useState<string>(useTypedSelector((state: any) => state.fourth.curriculum));
  const weeks = useTypedSelector((state: any) => state.fourth.weeks || []);

  useEffect(() => {
    if (programm_name === null || programm_name === "" || weeks.length === 0) {
      if (programm_name === 'Academic Excellence' && curriculum === '' || curriculum === null) {
        navigate('/fourth');
      }
    }
  }, [navigate, programm_name, weeks])

  const [metadata1] = useState<Metadata1Type>(useTypedSelector((state: any) => state.first));
  const [metadata2] = useState<Metadata2Type>(useTypedSelector((state: any) => state.second));
  const [metadata3] = useState<Metadata3Type>(useTypedSelector((state: any) => state.third));
  const [metadata4] = useState<Metadata4Type>(useTypedSelector((state: any) => state.fourth));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = value || '';
    const focusedValue: Focused = (name === 'number' || name === 'name' || name === 'expiry' || name === 'cvc') ? name : undefined;
    if (focusedValue !== undefined) {
      setCardInfo({ ...cardInfo, [name]: updatedValue, focused: focusedValue });
    }
  };
  const metadata = {
    student_full_name: metadata1.full_name,
    student_email: metadata1.email,
    student_phonenumber: metadata1.phone_number,
    student_date_birth: metadata1.date_birth,
    city: metadata2.city,
    country: metadata2.country,
    state: metadata2.state,
    street: metadata2.street,
    zip: metadata2.zip,
    current_school: metadata2.current_school,
    parent_full_name: metadata3.full_name,
    parent_email: metadata3.email,
    parent_number: metadata3.number,
    curriculum: metadata4.curriculum,
    programm_name: metadata4.programm_name,
    weeks: JSON.stringify(metadata4.weeks.map(week => ({ label: week.label, price: week.price }))),
    total: calculateTotalPrice(),
  };

  type Focused = 'number' | 'name' | 'expiry' | 'cvc' | undefined;
  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    focused: undefined as Focused,
  });

  const [success, setSuccess] = useState<boolean>(false);
  const handlePrevious = () => {
    navigate('/fourth');
  };

  const handleFocus = (field: Focused) => {
    setCardInfo({ ...cardInfo, focused: field });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (cardNumberElement && cardExpiryElement && cardCvcElement) {
      const payload = await stripe.createToken(cardNumberElement);
      if (payload.error) {
        console.log('[error]', payload.error);
      } else {
        console.log('[PaymentMethod]', payload.token);
        try {
          const response = await axios.post('https://api.summer-enrol.iwsonlineschool.co.uk/payment/', {
            token: payload.token.id,
            amount: calculateTotalPrice(),
            metadata: metadata,
          });
          clearFirst();
          clearSecond();
          clearThird();
          clearFourth();
          setSuccess(true)

          // Handle successful payment here, perhaps navigate to a success page or display a success message
        } catch (error) {
          console.error('Payment Error:', error);
          // Handle payment error here, perhaps setting an error state and displaying it to the user
        }
        // Send the token to your server for payment processing
      }
    }
  };

  return (
    <>
      {
        stripe && elements && !success &&
        <div className='px-10 animate-fade-in'>
          <div className=' justify-center items-center flex-col flex'>
            <div className='sm:px-10 max-w-[700px] shadow-lg'>
              <h1 className=' text-[38px] font-bold text-primary text-center font-roboto py-3'>Enrolment Form</h1>
              <div className='flex flex-wrap'>
                <Steps number={1} title='Student Information' status='finished' />
                <Steps number={2} title='Address' status='finished' />
                <Steps number={3} title='Parent Information' status='finished' />
                <Steps number={4} title='Programme Selection' status='finished' />
                <Steps number={5} title='Payment' status='active' />
              </div>

              <h2 className='text-[28px] font-bold text-black font-roboto py-3'>Payment</h2>

              <div>

                {/* <div className='border-t-[1px] border-gray pt-2 py-2'>

                  <div>
                    <div className='flex justify-between items-center py-3'>
                      <div className='font-semibold text-textPrimary'>
                        Student Information:
                      </div>
                      <div className='text-[14px] cursor-pointer text-blue-500 hover:text-blue-600 font-semibold'>
                        Show
                      </div>

                    </div>
                    <div className='px-3 text-[14px] text-textPrimary'>

                      <div className=' grid grid-cols-3 items-end py-1'>
                        <div className=' col-span-1 font-semibold'>
                          Full Name of Student:
                        </div>
                        <div className='ml-3 col-span-2 overflow-auto'>
                          Gullyyew Kerim dasdasd
                        </div>
                      </div>

                      <div className=' grid grid-cols-3 items-end py-1'>
                        <div className=' col-span-1 font-semibold'>
                          Email:
                        </div>
                        <div className='ml-3 col-span-2 overflow-hidden'>
                          Gullyyewsfsdfds@asdasd.com
                        </div>
                      </div>

                      <div className=' grid grid-cols-3 items-end py-1'>
                        <div className=' col-span-1 font-semibold'>
                          Phone Number:
                        </div>
                        <div className='ml-3 col-span-2 overflow-hidden'>
                          +40757711519
                        </div>
                      </div>
                      <div className=' grid grid-cols-3 items-end py-1'>
                        <div className=' col-span-1 font-semibold'>
                          Date of Birth:
                        </div>
                        <div className='ml-3 col-span-2 overflow-hidden'>
                          12/12/1998
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between items-center py-3'>
                    <div className='font-semibold text-textPrimary'>
                      Address:
                    </div>
                    <div className='text-[14px] cursor-pointer text-blue-500 hover:text-blue-600 font-semibold'>
                      Show
                    </div>
                  </div>

                  <div className='flex justify-between items-center py-3'>
                    <div className='font-semibold text-textPrimary'>
                      Parent Information:
                    </div>
                    <div className='text-[14px] cursor-pointer text-blue-500 hover:text-blue-600 font-semibold'>
                      Show
                    </div>
                  </div>

                  <div className='flex justify-between items-center py-3'>
                    <div className='font-semibold text-textPrimary'>
                      Selected Programms:
                    </div>
                    <div className='text-[14px] cursor-pointer text-blue-500 hover:text-blue-600 font-semibold'>
                      Show
                    </div>
                  </div>
                </div> */}
                <div className=' border-t-[1px] text-textPrimary border-gray pt-2  py-2'>
                  <div className='pt-3'>
                    <Cards
                      number={cardInfo.number}
                      name={cardInfo.name}
                      expiry={cardInfo.expiry}
                      cvc={cardInfo.cvc}
                      focused={cardInfo.focused}
                    />
                    <form onSubmit={handleSubmit}>
                      <div className='px-2 py-6 text-textPrimary sm:px-12 md:px16 sm:py-10'>
                        <div className='pb-2 sm:pb-6'>
                          <div className=' sm:grid sm:grid-cols-12'>
                            <div className='pb-2 sm:col-span-6 sm:gri sm:pb-6'>
                              <CardNumberElement className="w-full px-3 py-2 border border-darkGray rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={(e) => setCardInfo({ ...cardInfo, number: e.complete ? '#### #### #### ####' : '' })} onFocus={() => handleFocus('number')} />
                            </div>
                            <div className='pb-2 sm:col-span-3 sm:px-3 sm:pb-6'>
                              <CardExpiryElement className=" w-full px-3 py-2  border border-darkGray rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.complete ? '##/##' : '' })} onFocus={() => handleFocus('expiry')} />
                            </div>
                            <div className='pb-2 sm:col-span-3 sm:pb-6'>
                              <CardCvcElement className=" w-full px-3 py-2  border border-darkGray rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.complete ? '###' : '' })} onFocus={() => handleFocus('cvc')} />
                            </div>
                          </div>
                          <input
                            className="w-full flex flex-1 px-3 py-1 border border-darkGray rounded-md text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={cardInfo.name}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('name')}
                          />
                        </div>
                        <div className=' my-6 flex justify-between'>
                          <div onClick={handlePrevious} className='px-8 py-2 group rounded-xl bg-gray hover:bg-darkGray duration-150 cursor-pointer'>
                            <div className='text-black group-hover:text-white font-semibold text-[18px]'>Previous</div>
                          </div>
                          <button type="submit" className='px-8 py-2 rounded-full bg-primary'>
                            <div className='text-white font-semibold text-[18px]'>Submit</div>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {
        success && (
          <SuccessPayment />
        )
      }

    </>
  );
};

const Fifth = () => {
  return (
    <Elements stripe={stripePromise}>
      <CustomCardForm />
    </Elements>
  );
};

export default Fifth;
