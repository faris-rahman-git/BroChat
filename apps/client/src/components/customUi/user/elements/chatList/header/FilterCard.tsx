import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { Card } from '@client/components/ui/card';
import { filterOptions } from '@client/constants/userConstant/chatListConstants';
import { RefObject } from 'react';

function FilterCard({
  filterRef,
}: {
  filterRef: RefObject<HTMLDivElement | null>;
}) {
  const handleFilters = (label: string) => {
    // if (label === 'Filter') {
    //   if (activeTab === 'Filter') {
    //     setActiveTab('');
    //   } else {
    //     setActiveTab('Filter');
    //   }
    // } else {
    //   if (activeTab === 'New Chat') {
    //     setActiveTab('');
    //   } else {
    //     setActiveTab('New Chat');
    //   }
    // }
  };

  return (
    <Card
      ref={filterRef}
      className="absolute top-[125%] left-0 z-10 flex justify-center items-center shadow-md rounded-[6px] bg-[#F3F3F3] min-w-[225px] h-auto"
    >
      <div className="flex flex-col gap-2 w-[90%]">
        <span className="ps-[9px] text-sm font-semibold">Filter Chat By</span>
        {filterOptions.map(({ icon: Icon, label }, index) => (
          <ButtonIcon
            key={index}
            Icon={Icon}
            label={label}
            onClick={() => handleFilters(label)}
            className="justify-start ps-[9px] w-full hover:bg-[#ffffff]"
          >
            <span className="whitespace-nowrap ps-[3px]">{label}</span>
          </ButtonIcon>
        ))}
      </div>
    </Card>
  );
}

export default FilterCard;
