function AuthHeading({ headData }: { headData: string }) {
  return (
    <div className="w-full">
      <h1 className="text-[38px] font-semibold text-[#414042] whitespace-nowrap">{headData}</h1>
    </div>
  );
}

export default AuthHeading;
