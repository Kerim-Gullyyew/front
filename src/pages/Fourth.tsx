import React, { useEffect, useState } from 'react';
import Radio from '../components/form/Radio';
import Steps from '../components/ui/Steps';
import Checkbox from '../components/form/Checkbox';
import { useNavigate } from 'react-router-dom';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';

// TypeScript interfaces
interface WeekOption {
  range: string;
  price: number;
  selected?: boolean;
}

interface Category {
  name: string;
  location: string;
  curriculums?: string[];
  weeks?: WeekOption[];
}

interface CustomisedPlanOption {
  description: string;
  weeks?: WeekOption[];
}

interface CustomisedSummerPlans {
  options: CustomisedPlanOption[];
}

interface SummerProgramData {
  categories: Category[];
  // customisedSummerPlans: CustomisedSummerPlans;
}

const exampleData: SummerProgramData = {
  categories: [
    {
      "name": "Academic Excellence",
      "location": "Roehampton University, London",
      "curriculums": [
        "IB",
        "I/GCSE",
        "A Level"
      ],
      "weeks": [
        { "range": "2nd-9th August", "price": 2000 },
        { "range": "9th-16th August", "price": 2000 },
        { "range": "16th-23rd August", "price": 2000 }
      ]
    },
    {
      "name": "Skills Evolution",
      "location": "Tonbridge School, Kent",
      "weeks": [
        { "range": "12th-19th July", "price": 1750 },
        { "range": "19th-26th July", "price": 1750 },
        { "range": "2nd-9th August", "price": 1750 },
        { "range": "9th-16th August", "price": 1750 },
        { "range": "16th-23rd August", "price": 1750 }
      ]
    },
    {
      "name": "Linguistic & Cultural Odyssey",
      "location": "Huddersfield, Manchester",
      "weeks": [
        { "range": "12th-19th July", "price": 1200 },
        { "range": "19th-26th July", "price": 1200 },
        { "range": "2nd-9th August", "price": 1200 },
        { "range": "9th-16th August", "price": 1200 },
        { "range": "16th-23rd August", "price": 1200 }
      ]
    },
    // {
    //   "name": "STEM and Maths Olympiad Preparation",
    //   "location": "Tonbridge School, Kent",
    //   "weeks": [
    //     { "range": "16th-23rd August", "price": 1750 }
    //   ]
    // }
  ],

  // customisedSummerPlans: {
  //   "options": [
  //     {
  //       "description": "1 Week of Academic Excellence + 1 Week of Skills Evolution",
  //       "weeks": [
  //         { "range": "Academic Excellence 2nd-9th August", "price": 2000 },
  //         { "range": "Academic Excellence 9th-16th August", "price": 2000 },
  //         { "range": "Academic Excellence 16th-23rd August", "price": 2000 },
  //         { "range": "Skills Evolution 12th-19th July", "price": 1750 },
  //         { "range": "Skills Evolution 19th-26th July", "price": 1750 },
  //         { "range": "Skills Evolution 2nd-9th August", "price": 1750 },
  //         { "range": "Skills Evolution 9th-16th August", "price": 1750 },
  //         { "range": "Skills Evolution 16th-23rd August", "price": 1750 }
  //       ]
  //     },
  //     {
  //       "description": "1 Week of Academic Excellence + 1 Week of Linguistic & Cultural Odyssey",
  //       "weeks": [
  //         { "range": "Academic Excellence 2nd-9th August", "price": 2000 },
  //         { "range": "Academic Excellence 9th-16th August", "price": 2000 },
  //         { "range": "Academic Excellence 16th-23rd August", "price": 2000 },
  //         { "range": "Linguistic & Cultural Odyssey 2nd-9th August", "price": 1200 },
  //         { "range": "Linguistic & Cultural Odyssey 9th-16th August", "price": 1200 },
  //         { "range": "Linguistic & Cultural Odyssey 16th-23rd August", "price": 1200 }
  //       ]
  //     },
  //     {
  //       "description": "1 Week of Skills Evolution + 1 Week of Linguistic & Cultural Odyssey",
  //       "weeks": [
  //         { "range": "Skills Evolution 12th-19th July", "price": 1750 },
  //         { "range": "Skills Evolution 19th-26th July", "price": 1750 },
  //         { "range": "Skills Evolution 2nd-9th August", "price": 1750 },
  //         { "range": "Skills Evolution 9th-16th August", "price": 1750 },
  //         { "range": "Skills Evolution 16th-23rd August", "price": 1750 },
  //         { "range": "Linguistic & Cultural Odyssey 2nd-9th August", "price": 1200 },
  //         { "range": "Linguistic & Cultural Odyssey 9th-16th August", "price": 1200 },
  //         { "range": "Linguistic & Cultural Odyssey 16th-23rd August", "price": 1200 }
  //       ]
  //     }
  //   ]
  // }
};

const SummerPrograms: React.FC<{ data: SummerProgramData }> = ({ data }) => {
  const navigate = useNavigate();
  const { addFourth } = useActions();
  const array = useTypedSelector((state: any) => state.fourth.weeks || []);
  let convertedObject = array.reduce((obj: any, item: any) => {
    if (item && item.label && typeof item.price === 'number') {
      obj[item.label] = { price: item.price, selected: true };
    }
    return obj;
  }, {});


  const [third] = useState<string>(useTypedSelector((state: any) => state.third));

  useEffect(() => {
    const isFirstStateFull = third && Object.values(third).every(value => value !== null && value !== '');
    if (!isFirstStateFull) {
      navigate('/third');
    }
  }, [navigate, third])

  const [selectedProgrammValue, setSelectedProgrammValue] = useState<string>(useTypedSelector((state: any) => state.fourth.programm_name));

  const [selectedCurricumValue, setSelectedCurricumValue] = useState<string | null>(useTypedSelector((state: any) => state.fourth.curriculum));
  const [selectedCustomOptionValue, setSelectedCustomOptionValue] = useState<string>(useTypedSelector((state: any) => state.fourth.custom_description));
  const [selectedWeeks, setSelectedWeeks] = useState<Record<string, { price: number, selected: boolean }>>(convertedObject);
  const [error, setError] = useState<string>("");

  const calculateTotalPrice = () => {
    return Object.values(selectedWeeks)
      .filter(week => week.selected)
      .reduce((total, week) => total + week.price, 0);
  };

  const handleCheckboxChange = (data: { week: string, price: number }) => {
    setSelectedWeeks(prevState => ({
      ...prevState,
      [data.week]: {
        price: data.price,
        selected: !prevState[data.week]?.selected
      }
    }));
  };

  const handleNext = () => {
    const selectedWeeksInfo: { label: string, price: number }[] = Object.entries(selectedWeeks)
      .filter(([_, value]) => value.selected)
      .map(([key, value]) => ({ label: key, price: value.price }));

    const json = {
      programm_name: selectedProgrammValue,
      custom_description: selectedCustomOptionValue,
      curriculum: selectedCurricumValue,
      weeks: selectedWeeksInfo
    }

    if (selectedProgrammValue && selectedWeeksInfo.length > 0) {
      addFourth(json);
      navigate('/fifth');
    } else {
      setError("Please select a program and at least one week");
    }
  };

  const handlePrevious = () => {
    navigate('/third');
  };

  const handleChangeProgramm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProgrammValue(event.target.value);
    setSelectedWeeks({});
    setSelectedCurricumValue('');
  };

  const handleChangeCustomOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCustomOptionValue(event.target.value);
    setSelectedWeeks({});
    setSelectedCurricumValue('');
  };

  const handleChangeCurricum = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCurricumValue(event.target.value);
  };
  return (
    <div className='px-10 animate-fade-in'>
      <div className=' justify-center items-center flex-col flex'>
        <div className='sm:px-10 max-w-[700px] shadow-lg'>
          <h1 className=' text-[38px] font-bold text-primary text-center font-roboto py-3'>Enrolment Form</h1>
          <div className='flex flex-wrap'>
            <Steps number={1} title='Student Information' status='finished' />
            <Steps number={2} title='Address' status='finished' />
            <Steps number={3} title='Parent Information' status='finished' />
            <Steps number={4} title='Programme Selection' status='active' />
            <Steps number={5} title='Payment' status='default' />
          </div>
          <h2 className='text-[28px] font-bold text-textPrimary font-roboto py-3'>Programme Selection</h2>
          <div className=' border-t-[1px] text-textPrimary border-gray pt-2 py-2'>
            <div className='flex flex-col my-6'>
              {
                data.categories.map((category, index) => (
                  <div key={index}>
                    <Radio value={category.name} name="programSelection" checked={selectedProgrammValue === category.name} onChange={handleChangeProgramm} />
                  </div>
                ))
              }
              {/* <Radio value='Customised Summer Plans' name='programSelection' checked={selectedProgrammValue === 'Customised Summer Plans'} onChange={handleChangeProgramm} /> */}
              {data.categories.map((category, index) => (
                <div key={index}>
                  {
                    selectedProgrammValue === category.name && (
                      <>
                        {category.curriculums && selectedProgrammValue === category.name && (
                          <>
                            <div className='flex flex-col pt-8'>
                              <p>Select Curriculum (Required)</p>
                              {category.curriculums.map((curriculum, curriculumIndex) => (
                                <Radio key={curriculumIndex} name='curriculum' value={curriculum} checked={selectedCurricumValue === curriculum} onChange={handleChangeCurricum} />
                              ))}
                            </div>
                          </>
                        )}
                        {
                          category.weeks && (
                            <>
                              <div className='pt-8'>
                                <p>Select Weeks: {category.name} (Required)</p>
                                {category.weeks.map((week, weekIndex) => (
                                  <div key={weekIndex}>
                                    <Checkbox
                                      key={weekIndex}
                                      id={`week-checkbox-${weekIndex}`}
                                      label={week.range}
                                      isChecked={selectedWeeks[week.range]?.selected ?? false}
                                      onCheckboxChange={() => handleCheckboxChange({ week: week.range, price: week.price })}
                                    />
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                      </>
                    )
                  }
                </div>
              ))}
            </div>
            {/* <div>
              {
                selectedProgrammValue === 'Customised Summer Plans' && (
                  <>
                    <p>Customised Plan (Required)</p>
                    {
                      data.customisedSummerPlans.options.map((option, optionIndex) => (
                        <Radio key={optionIndex} name='customOption' value={option.description} checked={selectedCustomOptionValue === option.description} onChange={handleChangeCustomOption} />
                      ))
                    }
                    {
                      data.customisedSummerPlans.options.map((option, optionIndex) => (
                        <div key={optionIndex} className='pt-8'>
                          {
                            selectedCustomOptionValue === option.description && option.weeks && (
                              <div>
                                <p>Select Weeks: {option.description} (Required)</p>
                                {
                                  option.weeks.map((week, index) => (
                                    <div key={index}>
                                      <Checkbox
                                        key={index}
                                        id={`week-checkbox-${index}`}
                                        label={week.range}
                                        isChecked={selectedWeeks[week.range]?.selected ?? false}
                                        onCheckboxChange={() => handleCheckboxChange({ week: week.range, price: week.price })}
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                            )}
                        </div>
                      ))}
                  </>
                )
              }
            </div> */}
            <div>
              <div>
                {error && <p className="text-red-500">{error}</p>}
                <h2>Total: £{calculateTotalPrice()}</h2>
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
  );
};

const Fourth: React.FC = () => {
  return <SummerPrograms data={exampleData} />;
};

export default Fourth;
