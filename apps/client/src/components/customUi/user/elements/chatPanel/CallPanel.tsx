import { JSX, useState } from 'react';
import { Card, CardContent } from '@client/components/ui/card';
import { selectCallsByConversation } from '@client/redux/selectors/selectCallsByConversation';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import {
  LuPhoneIncoming,
  LuPhoneOutgoing,
  LuPhoneMissed,
  LuPhoneOff,
} from 'react-icons/lu';
import VideoCallStatus from '@client/components/customUi/commonElemets/VideoCallStatus';
import { Phone, Video } from 'lucide-react';
import {
  formatDurationMs,
  getOtherUserCallDurationFormatted,
} from '@client/utils/getMyCallDurationFormatted';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

function CallPanel({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  const calls = useSelector((state: RootState) =>
    selectCallsByConversation(state, conversationId)
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  type IconKey =
    | 'voice-call-incoming'
    | 'voice-call-outgoing'
    | 'voice-call-missed'
    | 'voice-call-rejected'
    | 'video-call-incoming'
    | 'video-call-outgoing'
    | 'video-call-missed'
    | 'video-call-rejected';

  const iconsMap: Record<IconKey, JSX.Element> = {
    'voice-call-incoming': (
      <LuPhoneIncoming className="size-4 text-black opacity-50" />
    ),
    'voice-call-outgoing': (
      <LuPhoneOutgoing className="size-4 text-black opacity-50" />
    ),
    'voice-call-missed': (
      <LuPhoneMissed className="size-4 text-black opacity-50" />
    ),
    'voice-call-rejected': (
      <LuPhoneOff className="size-4 text-black opacity-50" />
    ),
    'video-call-incoming': (
      <VideoCallStatus
        type="incoming"
        className="size-6 text-black opacity-50"
      />
    ),
    'video-call-outgoing': (
      <VideoCallStatus
        type="outgoing"
        className="size-6 text-black opacity-50"
      />
    ),
    'video-call-missed': (
      <VideoCallStatus type="missed" className="size-6 text-black opacity-50" />
    ),
    'video-call-rejected': (
      <VideoCallStatus
        type="rejected"
        className="size-6 text-black opacity-50"
      />
    ),
  };

  return (
    <div className="flex flex-col gap-5 my-5">
      {calls.map((call) => {
        const isCaller = call.callerId._id === userId;
        const duration = call.isGroupCall
          ? formatDurationMs(Number(call.duration))
          : getOtherUserCallDurationFormatted(call);
        let finalStatus: 'missed' | 'accepted' | 'rejected' = 'missed';
        let missedByMe = false;

        if (!call.isGroupCall) {
          if (isCaller) {
            const other = call.receivers.find((r) => r.userId._id !== userId);
            if (other?.status) finalStatus = other.status;
            if (other?.status === 'missed') missedByMe = false;
          } else {
            const me = call.receivers.find((r) => r.userId._id === userId);
            if (me?.status) finalStatus = me.status;
            if (me?.status === 'missed') missedByMe = true;
          }
        } else {
          if (isCaller) {
            const others = call.receivers.filter(
              (r) => r.userId._id !== userId
            );
            const anyAccepted = others.some((r) => r.status === 'accepted');
            const allRejected = others.every((r) => r.status === 'rejected');
            const allMissed = others.every((r) => r.status === 'missed');

            if (anyAccepted) finalStatus = 'accepted';
            else if (allRejected) finalStatus = 'rejected';
            else if (allMissed) finalStatus = 'missed';

            if (allMissed) missedByMe = false;
          } else {
            const me = call.receivers.find((r) => r.userId._id === userId);
            if (me?.status) finalStatus = me.status;
            if (me?.status === 'missed') missedByMe = true;
          }
        }

        const callDirection = isCaller ? 'outgoing' : 'incoming';
        const iconKey: IconKey = `${
          call.isVideoCall ? 'video' : 'voice'
        }-call-${finalStatus === 'accepted' ? callDirection : finalStatus}`;

        const startedAt = new Date(call.startedAt);
        const date = startedAt.toLocaleDateString();
        const time = startedAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const callTypeIcon = call.isVideoCall ? (
          <Video size={18} />
        ) : (
          <Phone size={18} />
        );

        const isExpanded = expandedId === call.roomId;

        return (
          <div key={call.roomId} className="w-full">
            <Card
              onClick={() => setExpandedId(isExpanded ? null : call.roomId)}
              className={`mx-5  border-0 h-[70px] flex justify-center cursor-pointer rounded-[6px] ${
                !isExpanded ? '' : 'rounded-b-[0px]'
              }`}
            >
              <CardContent className="flex items-center justify-between p-3 w-full">
                {/* Left */}
                <div className="flex items-center gap-2 text-black">
                  {callTypeIcon}
                  <span className="font-normal text-base">
                    {call.isVideoCall ? 'Video Call' : 'Voice Call'}
                  </span>
                </div>

                {/* Middle */}
                <div className="flex items-center gap-2 text-black">
                  {iconsMap[iconKey]}
                  <span className="font-normal text-base">
                    {finalStatus === 'missed'
                      ? missedByMe
                        ? 'Missed'
                        : 'Unanswered'
                      : finalStatus === 'rejected'
                      ? 'Rejected'
                      : `Accepted (${duration})`}
                  </span>
                </div>

                {/* Right */}
                <div className="flex flex-col justify-between items-end gap-1 text-[#999999] text-sm">
                  <div>{date}</div>
                  <div>{time}</div>
                </div>
              </CardContent>
            </Card>

            {isExpanded && (
              <div className="bg-white p-4 mx-5 rounded-b-md border-0 border-t-0 shadow">
                <p className="font-semibold mb-2">Participants</p>

                {[
                  ...call.receivers.map((r) => ({
                    ...r.userId,
                    status:
                      r.userId._id === call.callerId._id ? 'caller' : r.status,
                    duration: r.duration,
                    joinedAt: r.joinedAt,
                    leftAt: r.leftAt,
                  })),
                ].map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    {/* Left side: Avatar + Name + Status */}
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-[6px] overflow-hidden flex justify-center items-center bg-[#c9c9c9]">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.name}
                          className="object-cover size-full"
                        />
                        <AvatarFallback className="text-center">
                          {participant.name.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-medium">
                          {participant.name}
                          {participant._id === userId ? ' (You)' : ''}
                        </span>
                        <span className="text-sm text-gray-600">
                          {participant.status} •{' '}
                          {formatDurationMs(Number(participant.duration) || 0)}
                          {participant._id === call.callerId._id
                            ? ' (Call + Ringing Time)'
                            : ''}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Times */}
                    <div className="flex flex-col text-right text-xs text-gray-500">
                      <span>
                        Joined:{' '}
                        {participant.joinedAt
                          ? new Date(participant.joinedAt).toLocaleTimeString(
                              [],
                              {
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                              }
                            )
                          : '—'}
                      </span>
                      <span>
                        Left:{' '}
                        {participant.leftAt
                          ? new Date(participant.leftAt).toLocaleTimeString(
                              [],
                              {
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                              }
                            )
                          : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CallPanel;
