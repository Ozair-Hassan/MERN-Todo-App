import { logo } from '../assets/index'

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center mx-auto my-auto fixed top-0 left-0 w-screen z-50 bg-white h-screen overflow-hidden">
      <img
        src={logo}
        alt=""
        className="mt-10 md:mt-0 mb-2 xl:w-[30%] h-auto xs:w-[70%] md:w-[50%]"
      />

      <h1 className="flex flex-col justify-center items-center gradient-text font-extrabold py-5 mx-5 mt-10 md:mt-0 md:flex-row md:text-5xl sm:text-4xl xs:text-4xl">
        Loading
        <span className="animate-dots inline-flex justify-start items-start w-[36px] h-[40px]"></span>
      </h1>
    </div>
  )
}

export default Loader
