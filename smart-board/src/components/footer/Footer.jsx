const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pt-6 pb-4 lg:px-4 xl:flex-row">
      <p className="text-xs text-gray-600">
        © {new Date().getFullYear()} <span className="font-bold text-white">Indigo<span className="text-grad">Smart</span></span>
      </p>
      <ul className="mt-3 flex flex-wrap items-center gap-5 text-xs font-medium text-gray-600 xl:mt-0">
        <li>FastAPI</li>
        <li>·</li>
        <li>React 19</li>
        <li>·</li>
        <li>MySQL</li>
        <li>·</li>
        <li>Tailwind CSS</li>
      </ul>
    </div>
  );
};

export default Footer;
