const Footer = () => (
  <footer className="w-full bg-white border-t border-[#FFEDC7] mt-12 font-sans">
    <div className="w-full px-6 py-6 text-center">
      <p className="text-sm font-medium text-gray-500 tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[#EB4C4C] transition-colors duration-200 hover:text-[#FF7070]">
          InternStatus
        </span>{" "}
        — built with
      </p>
    </div>
  </footer>
);

export default Footer;