const Widget = ({ icon, title, subtitle, accent }) => {
  return (
    <div className="glass-card flex flex-row items-center !p-4">
      <div className="flex h-[72px] w-auto items-center">
        <div className="ico-grad flex h-12 w-12 items-center justify-center rounded-2xl text-white">
          {icon}
        </div>
      </div>
      <div className="ml-4 flex w-auto flex-col justify-center">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
          {title}
        </p>
        <h4 className="text-2xl font-extrabold text-white">{subtitle}</h4>
      </div>
    </div>
  );
};

export default Widget;
