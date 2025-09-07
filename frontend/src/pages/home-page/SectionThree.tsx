import {BellElectric, BookDown, type LucideProps, Rocket, ScanEye} from "lucide-react";
import React from "react";
import {Button} from "../../components/Button.tsx";

const cardsData = [
  {
    key: 1,
    icon: BookDown,
    color: 'bg-back-green',
    title: 'Імпорт транзакцій',
    description: 'Завантажте виписку по рахунку за будь-який період в форматі PDF або Excel',
  },
  {
    key: 2,
    icon: ScanEye,
    color: 'bg-analytic',
    title: 'Автоматична категоризація',
    description: 'Наш штучний інтелект миттєво класифікує ваші транзакції та вивчає ваші моделі витрат для отримання точної аналітики.',
  },
  {
    key: 3,
    icon: BellElectric,
    color: 'bg-smart',
    title: 'Отримуйте практичні інформацію і поради',
    description: 'Отримуйте персоналізовані рекомендації, сповіщення про бюджет та детальну аналітику для оптимізації ваших фінансів',
  },
];
const SectionThree = () => {
  return (
    <>
      <section className="flex flex-col justify-start items-start md:my-[120px] w-full">
        <div className="flex flex-col justify-center items-start mx-auto">
          <div className="text-[68px] font-bold text-header-text leading-[76px] tracking-tight text-center md:px-[80px]">
            <span>Подивись як </span>
            <span className="text-balancio"> Balancio </span>
            <span> працює</span>
          </div>
          <div className="mt-6 text-[20px] text-body-text my-4 leading-10 tracking-tight flex flex-col items-center w-full">
            <span>Від відстеження транзакцій до інтелектуальної аналітики — </span>
            <span>ознайомтесь з повним робочим процесом управління фінансами</span>
          </div>
        </div>
        <div className='flex flex-row w-wull border-b border-body-text pb-[60px]'>
          <div className='flex flex-col w-[50%] pr-4'>
            { cardsData.map((card) => {
              const renderIcon = () => {
                const IconComponent = card.icon as React.ComponentType<LucideProps>;
                return <IconComponent className="w-8 h-8" />;
              };
              const iconClass = `${card.color} w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg mt-6 mr-4"`;
                return (
                  <>
                    <div className='flex flex-row justify-between w-full'>
                      <div className={iconClass}>
                        { renderIcon() }
                      </div>
                      <div className='flex flex-col md:w-[460px]'>
                        <div className="mt-6 text-xl font-bold text-header-text mb-4">{card.title}</div>
                        <div className="text-body-text mb-6 leading-relaxed">{card.description}</div>
                      </div>
                    </div>
                  </>
                )
              }
            )}
          </div>
          <div className='flex flex-col w-[50%]'>
            <img src='/img/image2.webp'
                 alt="promo-image"
                 width={620}
                 height={530}
                 className="rounded-lg mt-6"
            />
          </div>
        </div>
        <div className='pb-[60px] w-full'>
          <div className="flex flex-col justify-center items-start mx-auto w-full mt-[30px]">
            <div className="text-[36px] font-bold text-header-text leading-[36px] tracking-tight text-center md:px-[80px] w-full">
              <span>Готовий змінити своє </span>
              <span className="text-balancio"> Фінансове життя? </span>
            </div>
            <div className="mt-6 text-[20px] text-body-text my-4 leading-8 tracking-tight flex flex-col items-center w-full">
              <span>Приєднуйтесь до тисяч користувачів, які взяли під контроль </span>
              <span>свої фінанси за допомогою потужних інструментів та аналітики <span className='text-balancio'>Balancio</span>.</span>
            </div>
          </div>
          <div className='w-full flex items-center justify-center mt-6'>
            <Button variant='danger' classes="rounded-full" icon={Rocket}>
              Почніть знайомство зараз
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default SectionThree;
