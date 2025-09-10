import { Button } from "../../components/Button.tsx";
import { Rocket } from "lucide-react";

const SectionOne = () => {
  return (
    <>
      <section className="flex flex-row justify-between items-start md:my-[120px] w-full">
        <div className="flex flex-col justify-start items-start w-[40%]">
          <div className="w-[240px] h-[40px] mb-2 rounded-full bg-back-green"></div>
          <div className="text-[68px] font-bold text-header-text leading-[76px] tracking-tight">
            Візьміть під контроль свої
            <span className="text-back-green"> витрати</span>
          </div>
          <div className="text-[20px] text-body-text my-4 leading-8 tracking-tight">
            <span className="text-balancio font-bold">Balancio</span> допомагає вам відстежувати доходи,
            аналізувати витрати та приймати розумніші фінансові рішення
            за допомогою потужної аналітики та персоналізованих рекомендацій.
          </div>
          <Button variant='danger' classes="rounded-full" icon={Rocket}>
            Почніть знайомство зараз
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center w-[60%]">
          <img src='/img/image1.webp'
               alt="promo-image"
               width={620}
               height={530}
               className="rounded-lg ml-4 shadow-lg"
          />
        </div>
      </section>
    </>
  )
}

export default SectionOne;
