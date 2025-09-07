import {ArrowRightLeft, BellElectric, ChartPie, Search, Shell, TriangleAlert} from "lucide-react";
import FeatureCard from "./FeatureCard";

const cardsData = [
  {
    key: 1,
    icon: ArrowRightLeft,
    color: 'bg-back-green',
    title: 'Керування транзакціями',
    description: 'Легко відстежуйте всі свої доходи та витрати за допомогою розумної категоризації та автоматичного імпорту транзакцій.',
  },
  {
    key: 2,
    icon: ChartPie,
    color: 'bg-analytic',
    title: 'Аналітика та звітність',
    description: 'Отримуйте детальну інформацію завдяки красивим візуалізаціям, розподілу за категоріями та вичерпним фінансовим звітам.',
  },
  {
    key: 3,
    icon: Shell,
    color: 'bg-smart',
    title: 'Розумне прогнозування',
    description: 'Плануйте заздалегідь за допомогою прогнозування витрат та бюджетних прогнозів на основі штучного інтелекту на основі ваших моделей витрат.',
  },
  {
    key: 4,
    icon: Search,
    color: 'bg-balancio',
    title: 'Розширений пошук і фільтрація',
    description: 'Миттєво знаходьте будь-яку транзакцію завдяки потужним можливостям пошуку та фільтрації по всіх ваших даних.',
  },
  {
    key: 5,
    icon: TriangleAlert,
    color: 'bg-anomaly',
    title: 'Виявлення аномалій',
    description: 'Будьте пильними завдяки інтелектуальному виявленню аномалій, яке позначає незвичайні моделі витрат та потенційні проблеми.',
  },
  {
    key: 6,
    icon: BellElectric,
    color: 'bg-personalised',
    title: 'Персоналізовані рекомендації',
    description: 'Отримайте персоналізовані фінансові поради та практичні рекомендації для покращення управління вашими фінансами.',
  },
];
const SectionTwo = () => {
  return (
    <>
      <section className="flex flex-col justify-start items-start md:my-[120px] w-full">
        <div className="flex flex-col justify-center items-start mx-auto">
          <div className="text-[68px] font-bold text-header-text leading-[76px] tracking-tight text-center md:px-[80px]">
            <span>Потужні функції для </span>
            <span className="text-analytic">Розумного Управління Фінансами</span>
          </div>
          <div className="mt-6 text-[20px] text-body-text my-4 leading-10 tracking-tight flex flex-col items-center w-full">
            <span>Все, що вам потрібно для відстеження, аналізу та оптимізації</span>
            <span>вашого фінансового життя в одній комплексній платформі</span>
          </div>
        </div>
        <div className="mt-6 flex flex-row flex-wrap gap-y-6">
          { cardsData.map((card) => {
            return (
              <FeatureCard
                key={card.key}
                icon={card.icon}
                title={card.title}
                description={card.description}
                color={card.color}/>
              )
            }
          )}
        </div>
      </section>
    </>
  )
}

export default SectionTwo;
