const PrimaryButton = ({text}) => {
  return(
    <div className="rounded-lg text-white text-xl px-12 py-4 bg-primary hover:opacity-90">
      {text}
    </div>
  )
};

export default PrimaryButton;