const SectionOne = () => {
  return (
    <>
      <section className="flex flex-row justify-between items-start my-20 w-full">
        <div className="flex flex-col justify-start items-start w-[50%]">
          <div className="w-[240px] h-[40px] mb-2 rounded-full bg-back-green"></div>
          <div className="text-[68px] font-bold text-header-text leading-[64px] tracking-tight">
            Візьміть під контроль свої
            <span className="text-back-green"> витрати</span>
          </div>
          <div className="text-[20px] text-body-text mt-4 leading-6 tracking-tight">
            <span className="text-balancio font-bold">Balancio</span> допомагає вам відстежувати доходи,
            аналізувати витрати та приймати розумніші фінансові рішення
            за допомогою потужної аналітики та персоналізованих рекомендацій.
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-[50%]">
          <img src='/img/image1.webp'
               alt="promo-image"
               width={620}
               height={530}
               className="rounded-lg"
          />
        </div>
      </section>
    </>
  )
}

export default SectionOne;
