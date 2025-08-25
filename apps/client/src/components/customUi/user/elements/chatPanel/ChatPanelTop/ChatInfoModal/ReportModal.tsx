import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@client/components/ui/radio-group';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { useReportModalModalHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/ChatPanelTop/ChatInfoModal/useReportModalModalHook';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setOpenBlockModal: (open: boolean) => void;
  checkBlock?: boolean;
};

function ReportModal({
  open,
  onOpenChange,
  setOpenBlockModal,
  checkBlock,
}: Props) {
  
  const { handleConfirm, reason, setReason, otherText, setOtherText } =
    useReportModalModalHook(onOpenChange, setOpenBlockModal, checkBlock);

  return (
    <CustomModals
      open={open}
      onOpenChange={onOpenChange}
      title="Report User"
      description="Please select a reason to report this user."
      confirmText="Report"
      onConfirm={handleConfirm}
    >
      <div className="space-y-4 pt-2">
        <RadioGroup
          value={reason}
          onValueChange={setReason}
          className="space-y-2"
        >
          {[
            'Spam / Scam',
            'Harassment / Intimidation',
            'Inappropriate Content',
            'hate speech / violence',
            'Other',
          ].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <RadioGroupItem value={item} id={item} />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </RadioGroup>

        {reason === 'Other' && (
          <Input
            placeholder="Please describe the issue"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
          />
        )}
      </div>
    </CustomModals>
  );
}

export default ReportModal;
