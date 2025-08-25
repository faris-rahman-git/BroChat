import { Button } from '@client/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import React from 'react';

function ExclusiveUserView({
  setExclusiveMakePlanModalOpen,
}: {
  setExclusiveMakePlanModalOpen: () => void;
}) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Become an Exclusive Member
        </CardTitle>
        <CardDescription>
          Unlock premium features and exclusive content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium">Exclusive Benefits:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Access exclusive chats with premium users
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Unlock special chat features and stickers
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Priority support for your queries
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Get early access to new chat features
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              30% service fee is taken by the app from each payment
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full md:w-auto justify-center items-center"
          onClick={setExclusiveMakePlanModalOpen}
        >
          Become Exclusive
        </Button>
      </CardFooter>
    </Card>
  );
}

export default React.memo(ExclusiveUserView);
