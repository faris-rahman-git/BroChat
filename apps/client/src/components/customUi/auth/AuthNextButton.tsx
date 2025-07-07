import { Button } from '../../ui/button';

function AuthNextButton({
  content,
  onClick,
}: {
  content: string;
  onClick?: () => void;
}) {
  return (
    <div className="w-full flex justify-center items-center pt-1">
      <Button
        onClick={onClick}
        className="w-full rounded-[8px] bg-[#615EF0] font-medium text-[18px] hover:bg-[#4E43F0] hover:cursor-pointer"
      >
        {content}
      </Button>
    </div>
  );
}

export default AuthNextButton;
