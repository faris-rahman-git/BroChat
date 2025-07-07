
function Errorspan({ message }: { message?: string }) {
  return (
    <span className="text-[#FF0000] text-[14px] block capitalize text-center text-nowrap">
      {message || '\u00A0'}
    </span>
  );
}

export default Errorspan